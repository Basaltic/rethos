import panelIcon from "url:~/assets/icon512.png"
import rethosPanelHTML from "url:~/panels/rethos/index.html"

function createPanels() {
  chrome.devtools.panels.create(
    "Rethos",
    panelIcon,
    rethosPanelHTML.split("/").pop(),
    function (panel) {
      console.log(panel)
    }
  )
}

createPanels()

function IndexDevtools() {
  return (
    <div>
      <h2>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h2>
    </div>
  )
}

export default IndexDevtools
