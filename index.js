'use strict'

const retry = require('p-retry')
const {fetch} = require('fetch-ponyfill')({Promise: require('pinkie-promise')})
const {stringify} = require('query-string')

const endpoint = 'https://overpass-api.de/api/interpreter'

const queryOverpass = (query) => {
	return retry(() => {
		return fetch(endpoint + '?' + stringify({data: query}), {
			// todo: decide on this
			// yields isomorphic code, but slower due to preflight request?
			// mode: 'cors',
			redirect: 'follow',
			headers: {
				accept: 'application/json',
				'user-agent': 'http://github.com/derhuerst/vbb-osm-relations'
			}
		})
		.then((res) => {
			if (!res.ok) {
				const err = new Error(res.statusText)
				err.statusCode = res.status
				throw err
			}
			return res.json()
		})
		.then((data) => {
			if (!data || !Array.isArray(data.elements)) {
				throw new Error('invalid response')
			}
			return data.elements
		})
	}, {minTimeout: 500})
}

module.exports = queryOverpass
