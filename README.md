# stockChart Exercise

### Technologies used
This site is made with Vanilla JS, Jquery and Bootstrap.
Also i am taking advantage of <a href="https://iexcloud.io">IEX Cloud</a> API to get the data used in the chart
Thanks to boostrap styling the site can be seen in mobile too. Try resizing the page when having the chart loaded.

### How to use
Just download the project and open the file in dashboard/index.html or go to 

### Project guide

```bash
.
├── assets -> contains only bootstrap files so you can ignore it.
└── dashboard
    ├── index.html -> is in charge of loading the main page and scripts. (there is no other page, sorry :/)
    ├── css -> folder contains the stylesheet of the site.
    └── js
        ├── init.js -> init features of external libraries (boostrap tooltip, Google linear chart)
        └── components -> folder contains the stylesheet of the site.
            └── dashboard
                ├── dashboard.js -> all the code that makes the chart work.
                └── stockCodes
                    └── stockCodeHandlers.js -> handles the stockCode fields events for showing and hidding
.

```

### What is missing?
I made this in my free time and with no FWK or JS compiler so this are some of the things it could be improved.
```bash
1_ No unit/integration/UI tests. I would need a testing framework like jasmin, jest, etc.
2_ JS, css, and hmtl not inlined, nor minified. This makes the page heavier than it could be. Using a framework like gulp could have solve this issue
3_ There is a token exposed in the code. It should be encripted in order to keep it, and in the best case, the backend should be in charge of taking all the requests to the api and attach the token to the request.
4_ dashboard.js have a lot of functionallity and the file could contain sub-scopes for some functions.
