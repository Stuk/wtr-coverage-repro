# Reproduction of WTR broken coverage bug

This repro shows how methods defined on a class with the arrow `=>` syntax break the coverage report in WTR in certain situations.

For issues https://github.com/modernweb-dev/web/issues/689 and https://github.com/istanbuljs/v8-to-istanbul/issues/121

To reproduce run `npm install` then `npm test`, and open `coverage/lcov-report/bad.js.html`.

Instead of coverage for the affected file, one will see:

```
Cannot read property 'decl' of undefined
TypeError: Cannot read property 'decl' of undefined
    at /Users/xxxx/wtr-coverage-repro/node_modules/istanbul-reports/lib/html/annotator.js:89:31
    at Array.forEach ()
    at annotateFunctions (/Users/xxxx/wtr-coverage-repro/node_modules/istanbul-reports/lib/html/annotator.js:86:29)
    at annotateSourceCode (/Users/xxxx/wtr-coverage-repro/node_modules/istanbul-reports/lib/html/annotator.js:234:9)
    at HtmlReport.onDetail (/Users/xxxx/wtr-coverage-repro/node_modules/istanbul-reports/lib/html/index.js:409:33)
    at LcovReport. [as onDetail] (/Users/xxxx/wtr-coverage-repro/node_modules/istanbul-reports/lib/lcov/index.js:28:23)
    at Visitor.value (/Users/xxxx/wtr-coverage-repro/node_modules/istanbul-lib-report/lib/tree.js:38:38)
    at ReportNode.visit (/Users/xxxx/wtr-coverage-repro/node_modules/istanbul-lib-report/lib/tree.js:88:21)
    at /Users/xxxx/wtr-coverage-repro/node_modules/istanbul-lib-report/lib/tree.js:92:19
    at Array.forEach ()
```

The suspected cause of this bug is:

1. Each test runs in its own context, and coverage is collected for all files which are loaded in each test run
2. The metadata for functions in a file is stored from the _first_ run that included that file
3. The coverage is combined from all test runs to produce the final coverage numbers
4. Methods authored with the arrow syntax `=>` are only defined at runtime when the constructor is executed, and if in point 2. the constructor in a file isn't executed, the metadata for those methods won't exist.

In this repro:

* `1-test.js` loads `Good` through `index.js` which _also_ includes `Bad.js`.
    - `Bad.js` is executed and so gains some coverage information, but `Bad`'s constructor is never executed, so point 4. above never occurs.
    - The coverage information is collected, but metadata about `Bad.method` doesn't exist, because that function never did exist in this test run
* `2-test.js` runs, and this does execute `Bad`'s constructor and so now there is coverage information for `Bad.method`
* When the coverage details are generated, and the coverage of `Bad.method` is collated the metadata for `Bad.method` does not exist, because the metadata was only stored from the first run of `1-test.js`. This is what results in the above stack trace.
