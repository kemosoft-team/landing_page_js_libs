
### Installing Footer generator by URL parameter 'bid':

In code injection > Header (Kemo Builder)

```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

In code injection > Footer (Kemo Builder)

```js
<script src="https://lp-js-libs.s3.sa-east-1.amazonaws.com/footerBrandInfo.js"></script>
```

Create a block at the bottom of the page. In the 'embed' content, create a div:
```html
  <div id="footer"></div>
```

Use a custom CSS:
```css
  .footer {
  	 font-family: Montserrat, sans-serif;
	   font-size: 0.9rem;
  	 color: #fff;
   }
```







