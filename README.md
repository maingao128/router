# router
no reflesh when change url

use like this
```
let router = new Router({
	usePushState: true,
	baseRoot: '/router-test',
	routes: {
		':key': 'aaa'
	},

	aaa: function(a, b){
		alert(a);
		alert(b);
	}
});
```
usePushState can use h5 property pushState,in this case, you can change path and search section
without reflesh.
alse when your project is SAP, you can change hash too

#### you can change url by this mothed

```
router.pageStart(href);
```