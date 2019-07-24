# query-overpass

**Query the [OpenStreetMap](https://www.openstreetmap.org/) [Overpass](https://overpass-api.de) API.** Yet another implementation, because it

- is isomorphic (works in the browser)
- is lightweight (doesn't contain any sophisticated parser)
- uses [`p-retry`](https://github.com/sindresorhus/p-retry) to resend requests

Other alternatives for you to evaluate:

- [`query-overpass`](https://github.com/perliedman/query-overpass) and a fork [`@sriharithalla/query-overpass`](https://github.com/SrihariThalla/query-overpass)
- [`idris-overpass`](https://github.com/idris-maps/idris-overpass) and [`idris-overpass-browser`](https://github.com/idris-maps/idris-overpass-browser)

[![npm version](https://img.shields.io/npm/v/@derhuerst/query-overpass.svg)](https://www.npmjs.com/package/@derhuerst/query-overpass)
[![build status](https://img.shields.io/travis/derhuerst/query-overpass.svg)](https://travis-ci.org/derhuerst/query-overpass)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/query-overpass.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install @derhuerst/query-overpass
```


## Usage

Pass in a string of [Overpass QL](http://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL). Returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of elements.

```js
const queryOverpass = require('@derhuerst/query-overpass')

queryOverpass(`
	[out:json][timeout:25];
	node(3378340880);
	out body;
`)
.then(console.log)
.catch(console.error)
```

```js
[ {
	type: 'node',
	id: 3378340880,
	lat: 52.5145076,
	lon: 13.35011,
	tags: {
		artist: 'Friedrich Drake',
		artwork_type: 'statue',
		colour: 'gold',
		height: '66.9',
		image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Victoria_Goldelse_Siegessaeule_Berlin.jpg',
		min_height: '58.6',
		name: 'Viktoria',
		'name:de': 'Siegessäule',
		'name:ru': 'Колонна победы',
		'name:zh': '勝利女神柱',
		reg_name: 'Goldelse',
		tourism: 'artwork',
		wheelchair: 'no'
	}
} ]
```

To use make requests from a web site, enable [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) using the `fetchMode` option:

```js
queryOverpass(query, {fetchMode: 'cors'})
```

To use `@derhuerst/query-overpass` with a custom Overpass API endpoint, use the `endpoint` option:

```js
queryOverpass(query, {endpoint: 'https://overpass.example.org'})
```


## Related

- [`osm-build-query`](https://github.com/csbrandt/osm-build-query) – Build a query for the OSM Overpass API that retrieves all elements within the bounding feature.
- [`osm-flatten-relation`](https://github.com/derhuerst/osm-flatten-relation) – Resolve an OpenStreetMap relation recursively.


## Contributing

If you have a question or have difficulties using `query-overpass`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/query-overpass/issues).
