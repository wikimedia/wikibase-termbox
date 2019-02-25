This project uses SCSS which is specified in the styles section on the individual [Single File Components](https://vuejs.org/v2/guide/single-file-components.html)

Shared configuration (e.g. colors) and some utility (e.g. mixins) can be found in [src/styles](../src/styles).

We follow the [BEM](http://getbem.com/) (Block, Element, Modifier) approach to create self-sufficient, portable components. Component styles are generally named as follows.

* Block
  * The component name (e.g. button)
* Element
  * A semantic name for a node inside a component (e.g. text) 
* Modifier
  * A state of a Block or Element (e.g. disabled)

As the output of this project gets integrated into pre-existing HTML that we do not fully control and that was not necessarily developed with consideration for component isolation, there is a chance that the mark-up we create is inadvertently matching selectors of legacy styles. To lower the chance of this happening we are using a prefix for all our classes: `wb-ui-`.

The above example would yield a class `wb-ui-button__text--disabled`
