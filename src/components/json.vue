<template>
	<pre class="json-viewer" v-html="locale"></pre>
</template>
<script>
	export default{
		props:['value','indent','theme'],
		data(){
			return {
			}
		},
		computed:{
			locale(){
				return this.syntaxHighlight(this.value||{})
			}
		},
		methods:{
			syntaxHighlight(json) {
				if (typeof json != 'string') {
					json = JSON.stringify(json, undefined, this.indent||4);
				}
				json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
				return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
					var cls = 'number';
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = 'key';
						} else {
							cls = 'string';
						}
					} else if (/true|false/.test(match)) {
						cls = 'boolean';
					} else if (/null/.test(match)) {
						cls = 'null';
					}
					return '<span class="' + cls + '">' + match + '</span>';
				});
			}
		}
	}
</script>
<style lang="scss">
	.json-viewer{
		font-size: .16rem;
	    line-height: 2;
	    background: #f8f8f8;
	    padding: 10px 20px;
		.string { 
			color: #4CAF50; 
		}
		.number { 
			color: #2196F3; 
		}
		.boolean { 
			color: #9C27B0; 
		}
		.null { 
			color: #607D8B; 
		}
		.key { 
			color: #f44336; 
		}
	}
</style>