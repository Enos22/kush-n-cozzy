
function resolveApiUrl() {
    if (typeof window !== 'undefined') {
        try {
            const params = new URLSearchParams(window.location.search);
            const apiParam = params.get('api');
            if (apiParam) return apiParam.replace(/\/$/, '');
        } catch (e) {
            // ignore
        }
        if (window.__API_URL__) return String(window.__API_URL__).replace(/\/$/, '');
        if (window.location && window.location.hostname === 'localhost') return 'http://localhost:4000';
    }
    return import.meta.env.VITE_API_URL || '';
}

const API_URL = resolveApiUrl();

async function request(path, options = {}) {
    // If no API_URL (production static site), read from local db.json
    if (!API_URL) {
        // Use the built base URL so fetch works when site is served from a subpath (GitHub Pages)
        const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
        const dbPath = `${base}/db.json`
        const resp = await fetch(dbPath, {
            headers: { 'content-type': 'application/json' },
        })
        if (!resp.ok) {
            const msg = await resp.text()
            throw new Error(msg || `Request failed with status ${resp.status}`)
        }
        const data = await resp.json()
        if (path === '/products') return data.products || []
        if (path.startsWith('/products/')) {
            const id = path.split('/').pop()
            const prod = (data.products || []).find((p) => String(p.id) === String(id))
            if (!prod) throw new Error('Not found')
            return prod
        }
        // unsupported path for static mode
        throw new Error('Unsupported API path for static site')
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message || `Request failed with status ${response.status}`)
    }

    if (response.status === 204) return null
    return response.json();
}

export function getProducts() {
    return request('/products')
}

export function getProduct(id) {
    return request(`/products/${id}`)
}

export function createProduct(beer) {
    return request('/products', {
        method: 'POST',
        body: JSON.stringify(beer),
    })
}

export function updateProduct(id, changes) {
    return request(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
    })
}

export function deleteProduct(id) {
    return request(`/products/${id}`, { method: 'DELETE' })
}