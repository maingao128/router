import Router from './index';

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

let element = document.getElementsByTagName('a');
let item, i = 0;
while(item = element[i++]){
	item.addEventListener('click', function(e){
		let current = e.target;
		let href = current.getAttribute('href');
		router.pageStart(href);
		e.preventDefault();
	}, false)
}
