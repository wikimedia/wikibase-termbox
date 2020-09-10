[Storybook](https://storybook.js.org/) is a development environment for UI components. It allows you to browse a collection of components, view the different states of each component, and interactively develop and test them.

Storybook can help us to not only look at components in the context of an individual use case or application but also in isolation, with a focus on reuse and consistency.

As we [style](./styles.md) our components using the BEM approach they can easily be used in multiple places. Depending on feasibility (compare [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)) it is good practice to develop the design system and the components that use it upfront, with storybook being its first user. Only then do we proceed to using the components in our application(s).

Consequently, all component introductions and changes are to be tracked using so called [stories](../stories) which list the components and their states, and showcase their use to peer developers.

Components which have validity across applications should be - in close collaboration between UX and developers - added to a shared component library (e.g. vue-components in https://github.com/wmde/wikit/) which is consumed by the applications and ensures consistency between them while unlocking synergies.
