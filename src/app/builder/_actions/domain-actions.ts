'use server'

import whois from 'whois-json'
import { resolveNs } from 'dns/promises'

export async function checkDomainAvailability(domain: string) {
    if (!domain || !domain.includes('.')) {
        return { success: false, error: "Invalid domain format" };
    }

    try {
        // 1. LAPIS 1: DNS CHECK (Paling Cepat & Paling Akurat untuk 'Taken')
        try {
            const ns = await resolveNs(domain);
            if (ns && ns.length > 0) {
                console.log(`DNS check: ${domain} is TAKEN (Found NS records)`);
                return { success: true, available: false, method: 'dns' };
            }
        } catch (dnsErr) {
            console.log(`DNS check: No records for ${domain}, checking RDAP...`);
        }

        // 2. LAPIS 2: RDAP CHECK (Modern HTTP Protocol)
        // RDAP lebih jarang diblokir dibanding WHOIS port 43
        try {
            const rdapUrl = `https://rdap.org/domain/${domain}`;
            const rdapRes = await fetch(rdapUrl, { signal: AbortSignal.timeout(5000) });

            if (rdapRes.status === 200) {
                console.log(`RDAP check: ${domain} is TAKEN (Found record)`);
                return { success: true, available: false, method: 'rdap' };
            } else if (rdapRes.status === 404) {
                console.log(`RDAP check: ${domain} not found (404), likely available.`);
                return { success: true, available: true, method: 'rdap' };
            }
        } catch (rdapErr) {
            console.log(`RDAP failed or timeout, falling back to traditional WHOIS...`);
        }

        // 3. LAPIS 3: TRADITIONAL WHOIS (Fallback Terakhir)
        const whoisPromise = whois(domain);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('WHOIS_TIMEOUT')), 8000)
        );

        const results = await Promise.race([whoisPromise, timeoutPromise]) as any;

        const isRegistered = !!(
            results.domainName ||
            results.registrar ||
            results.creationDate ||
            (results.status && results.status.toLowerCase().includes('client')) ||
            (results.status && results.status.toLowerCase().includes('ok'))
        );

        console.log(`WHOIS result for ${domain}:`, isRegistered ? "REGISTERED" : "AVAILABLE");

        return {
            success: true,
            available: !isRegistered,
            method: 'whois'
        };

    } catch (error: any) {
        console.error("Critical lookup failure:", error);

        // Final Fallback: Jika semua gagal tapi kita tidak dpt kepastian, 
        // kita anggap server sibuk tapi tetap berikan pesan yang sopan.
        return {
            success: false,
            error: "Registry servers are occupied. Please try another domain or check back in a few minutes."
        };
    }
}
