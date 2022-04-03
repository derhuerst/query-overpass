'use strict'

const retry = require('p-retry')
const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const {stringify} = require('query-string')

const defaults = {
	fetchMode: null,
	endpoint: 'https://overpass-api.de/api/interpreter',
	retryOpts: {minTimeout: 500, retries: 3}
}

const queryOverpass = (query, opt = {}) => {
	opt = Object.assign({}, defaults, opt)

	if ('string' !== typeof opt.endpoint) {
		throw new Error('opt.endpoint must be a string')
	}
	const url = opt.endpoint + '?' + stringify({data: query})
	const fetchOpts = {
		redirect: 'follow',
		headers: {
			accept: 'application/json',
			'user-agent': 'http://github.com/derhuerst/vbb-osm-relations'
		}
	}
	if (opt.fetchMode !== null) fetchOpts.mode = opt.fetchMode

	const attempt = () => {
		return fetch(url, fetchOpts)
		.then((res) => {
			if (!res.ok) {
				const err = new Error(res.statusText)
				err.statusCode = res.status
				err.reponseBody = null
				if (!res.headers.has('content-length') || parseInt(res.headers.get('content-length')) > 1024) {
					throw err
				}
				return res.text()
				.then((body) => {
					err.reponseBody = body
					throw err
				}, () => {
					throw err
				})
			}
			return res.json()
		})
		.then((data) => {
			if (!data || !Array.isArray(data.elements)) {
				const err = new Error('invalid response')
				err.responseBody = data
				throw err
			}
			return data.elements
		})
	}

	const retryOpts = Object.assign({}, defaults.retryOpts, opt.retryOpts || {})
	return retry(attempt, retryOpts)
}

module.exports = queryOverpass
