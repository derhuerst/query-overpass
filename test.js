'use strict'

const test = require('tape')

const queryOverpass = require('.')

const south = 52.45
const west = 13.35
const north = 52.5
const east = 13.4
const bbox = [south, west, north, east].join(',')
const query = `
	[out:json][timeout:25];
	node["railway"="subway_entrance"](${bbox});
	out body;
`

test('queryOverpass', (t) => {
	queryOverpass(query)
	.then((elements) => {
		t.ok(Array.isArray(elements))
		t.ok(elements.length > 0)
		for (let el of elements) {
			t.ok(el)
			t.equal(typeof el.type, 'string')
			t.equal(typeof el.id, 'number')
			t.equal(typeof el.lat, 'number')
			t.equal(typeof el.lon, 'number')
			if (el.tags) {
				t.notOk(Array.isArray(el.tags))
				t.equal(typeof el.tags, 'object')
			}
		}
		t.end()
	})
	.catch(t.ifError)
})

const UNREACHABLE = 'http://127.0.0.1:1'
test('custom endpoint fails', (t) => {
	t.plan(1)
	queryOverpass(query, {
		endpoint: UNREACHABLE,
		retryOpts: {retries: 0}
	})
	.catch(t.ok)
})
