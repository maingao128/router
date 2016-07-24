/*by maingao
	usePushState: use pushState to change url
	baseRoot: base root
	roots: {'path': fn}
*/
export default class Router{
	//initialize arguments
	constructor(options = {}){
		options.baseRoot      = (options.baseRoot.slice(-1) === '/' ? options.baseRoot : options.baseRoot + '/') || '/';
		this.history          = window.history;
		this.location         = window.location;
		this.handles          = [];
		this._hasPushState    = !!(this.history && this.history.pushState);
		Object.assign(this, options);
		this._initailize();
		return this;
	}
	//handle routes,get route reg and push reg and callback
	//to this.handles
	_initailize(){
		let arr = Object.keys(this.routes), item;

		while(item = arr.shift()){
			let route = this.routRegex(item);
			let callBack = this.routes[item];
			this.addMethods(route, (...arg) => {
				if(this[callBack] instanceof Function)
					this[callBack].apply(this, arg);
			})
		}
		this.fragment = this.getFragment();
		this._bindEvent();
	}

	_bindEvent(){
		let eventer = window.addEventListener;
		if(this.usePushState && this._hasPushState){
			eventer('popstate', this.linkUrl.bind(this));
		}else{
			eventer('hashchange', this.linkUrl.bind(this), false);
		}
		
	}
	//pushState: listening path and search changes
	//hashChange: listening the hash changes
	linkUrl(){
		let current = this.getFragment();
		if(current === this.fragment) return false;
		this.fragment = current;
		this.handles.forEach((item) => {
			let result = current.match(item.route);
			if(result && result[0]){
				result.shift();
				item.callBack.apply(this, result)
			}
		})
	}

	//get path or hash deppend on usePushState
	getFragment(){
		if(this.usePushState) return this.getPath(); 
		return this.getHash();	
		
	}

	getPath(){
		let pathname = (this.location.pathname + this.location.search).slice(this.baseRoot.length);
		return pathname.charAt(0) === '/' ? pathname.slice(1): pathname;
	}

	getHash(){
		let hash, match;
		if(hash = this.location.hash) return hash.slice(1);
		match = this.location.href.match(/#(.*)$/);
		return match && match[1] ? match[1] : '';
	}

	addMethods(route, fn){
		this.handles.push({
			route: route,
			callBack: fn
		});
	}

	routRegex(item){
		let route = item.replace(/\((.*?)\)/g, '(?:$1)?')
			.replace(/(\(\?)?:\w+/g, '([^/?]+)')
			.replace(/\*\w+/g, '([^?]*?)');

		return new RegExp(`^${route}(?:\\?([\\s\\S]*))?$`);
	}

	//this.pageStart(url, true) can turn to you page without reflesh
	pageStart(fragment, ...trigger){
		if(!fragment || fragment === this.fragment) return false;
		if(this.usePushState){
			let url = (fragment.charAt(0) === '?' ? this.baseRoot.slice(0, -1) : this.baseRoot) + fragment;
			this.history.pushState({}, document.title, url);
		}else{
			this.location.hash = fragment.slice(0, 1) === '#' ? fragment : `#${fragment}`;
		}
		if(trigger) this.linkUrl();
	}
}

