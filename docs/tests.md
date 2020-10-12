The termbox project makes heavy use of automated testing to ensure a high quality of the software and enable us to quickly apply changes with confidence.

## unit tests

These are tests of individual modules of the termbox project, typically with all dependencies mocked. Some may also be considered integration tests if they assert how multiple modules work in conjunction.

## edge-to-edge tests

These are tests against the server part of termbox using mocked mediawiki/wikibase dependencies which allow us to assert the output (mark-up) of the termbox service as it would be sent to browsers.

## browser tests (selenium)

Termbox browser tests are part of the Wikibase Repo test suite and test the functionality in integration with Wikibase. To run the tests locally follow the [instructions for running the Wikibase Repo browser tests](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/refs/heads/master/repo/tests/selenium/README.md).

The browser tests are currently not executed in CI jobs for this repository. Instead, the tests of the [Termbox version tagged inside Wikibase](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/refs/heads/master/view/lib/wikibase-termbox) run with the rest of Wikibase's browser test suite for all patches to its code repository.

While the idea of additionally adding browser tests of termbox with a mocked wikibase/mediawiki dependency also crossed our minds at the time, in the end we decided against it due to the combination of the following factors

* there are robust edge-to-edge tests inside of termbox (with a mocked wikibase/mediawiki dependency) which assert the rendered frontend mark-up for scenarios where we are testing with a large(r) numbers of test sets
* we knew we had browser tests encompassing the whole system (testing behavioral aspects) and did not want to not create fully redundant tests
* termbox's limited amount of user journeys (basically one read/write view) however meant that the tests run in isolation would be (almost) identical to the ones run against the whole system

As a consequence, termbox changes are only browser tested in CI when the termbox patch is merged and added to wikibase. The risks resulting from that are understood but we consider them largely mitigated by the edge-to-edge tests. Comparatively quick CI runs in the termbox subproject (~2mins in contrast to ~20mins in wikibase) is a positive effect of not running the integrating tests for all patches.
