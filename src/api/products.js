const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options = {}) {
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