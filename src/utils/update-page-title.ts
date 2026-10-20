export const updatePageTitle = (title: string = 'Y-API Sidebar') => {
  const pageTitle = document.querySelector("title")
  if (pageTitle) {
    pageTitle.textContent = title
  } else {
    console.warn("No title element found to update.")
  }
}
