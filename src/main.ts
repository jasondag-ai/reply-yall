import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-serif/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/screens.css'
import { mount } from './ui/app'

mount(document.querySelector<HTMLDivElement>('#app')!)
