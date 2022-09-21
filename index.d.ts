import PassageElement from '@passageidentity/passage-elements'
import { PassageUser } from '@passageidentity/passage-js';

export interface PassageProfileElement extends HTMLElement {
  appId?: string
  lang?: string
}

declare global {
    namespace JSX {
      interface IntrinsicElements {
        "passage-auth": PassageElement;
        "passage-login": PassageElement;
        "passage-register": PassageElement;
        "passage-profile": PassageElement;
      }
    }
  }
