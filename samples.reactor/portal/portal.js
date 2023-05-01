

// 1. "portal" is an arbitrary DOM element that is owned by another DOM element - its "owner"
// 2. events in "portal" are routed to the owner

// createPortal returns VDOM to render in place of "portal"ed DOM element

export function createPortal(portalOwner,kids,portalContainer/*existing DOM element*/) {
  portalContainer.patch(<>{kids}</>,true); 
  document.post(() => { portalContainer.ownerElement = portalOwner });
  return <popup/>; // we return <popup> element that a) is invisible by default
                   // b) will play the role of placeholder to recive attached/detached notifications
}
