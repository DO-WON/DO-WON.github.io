/** Renders data/contact.json into a short blurb + email link. */
Site.load("./data/contact.json", "contact-container", (container, { blurb, email }) => {
  if (blurb) container.appendChild(Site.el("p", null, blurb));
  if (email) {
    const p = Site.el("p");
    const a = document.createElement("a");
    a.href = `mailto:${email}`;
    a.textContent = email;
    p.appendChild(a);
    container.appendChild(p);
  }
});
