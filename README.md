## Install

`npm install vinyl-cache`

## usage

```
vinyl.src(someFile)
	.pipe(cache(someTransformation, cacheObject));
```

The `cacheObject` parameter is optional. If not given then a new cache will be created.
