'use strict'

const retry = require('p-retry')
const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const {stringify} = require('query-string')

const defaults = {
	endpoint: 'https://overpass-api.de/api/interpreter'
}

const queryOverpass = (query, opt = {}) => {
	opt = Object.assign({}, defaults, opt)

	if ('string' !== typeof opt.endpoint) {
		throw new Error('opt.endpoint must be a string')
	}
	const url = opt.endpoint + '?' + stringify({data: query})

	const fetchOpts = {
		// todo: decide on this
		// yields isomorphic code, but slower due to preflight request?
		// mode: 'cors',
		redirect: 'follow',
		headers: {
			accept: 'application/json',
			'user-agent': 'http://github.com/derhuerst/vbb-osm-relations'
		}
	}

	const attempt = () => {
		return fetch(url, fetchOpts)
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
	}

	return retry(attempt, {minTimeout: 500})
}

module.exports = queryOverpass
