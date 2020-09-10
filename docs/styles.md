This project uses SCSS. We employ it to specify the styles section on the individual [Single File Components](https://vuejs.org/v2/guide/single-file-components.html)

Shared configuration (e.g. colors in variables) and some utility (e.g. mixins) can be found in [src/styles](../src/styles).

We follow the [BEM](http://getbem.com/) (Block, Element, Modifier) approach to create self-sufficient, portable components. Component styles are generally named as follows.

* Block
  * The component name (e.g. button)
* Element
  * A semantic name for a node inside a component (e.g. text)
* Modifier
  * A state of a Block or Element (e.g. disabled)

In addition, we are using a prefix for all our classes: `wb-ui-`. This approach reduces the chances of our styles inadvertently matching 3rd party/legacy mark-up with which we integrate.

The above example would yield a class `wb-ui-button__text--disabled`.

The output of this project gets integrated into pre-existing pages that we do not fully control and the styles of which were not necessarily developed with consideration for component isolation. Additionally, browsers bring about their own default CSS for many HTML elements. To reduce the likeliness that the mark-up we create is inadvertently matching selectors of 3rd party/legacy styles we [employ](../src/components/App.vue) so-called ["reset CSS"](https://www.npmjs.com/package/reset-css) which undoes (within the realm of possibility) notorious styles for many elements and ensure that desired styles are actually implemented within the individual components' style definition.
