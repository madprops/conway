const CW = {}
CW.speed = 500
CW.grid_size = 22

CW.init = function (a) {
  let style = getComputedStyle(document.body)
  CW.size = parseInt(style.getPropertyValue("--size"))
  CW.grid_el = document.querySelector("#grid")
  CW.make_grid()
  CW.start()
}

CW.make_grid = function () {
  CW.grid_el.innerHTML = ""
  CW.grid = []
  let size = CW.size / CW.grid_size
  let x = 0
  let y = 0
  let row = []

  for (let yy = 0; yy < CW.grid_size; yy++) {
    for (let xx = 0; xx < CW.grid_size; xx++) {
      let item = {}
      item.y = yy
      item.x = xx
      item.alive = CW.random_int(0, 1) === 1

      let block = document.createElement("div")
      block.style.width = size + "px"
      block.style.height = size + "px"
      block.style.left = x + "px"
      block.style.top = y + "px"
      block.classList.add("block")
      
      if (item.alive) {
        block.classList.add("alive")
      }

      item.block = block
      row.push(item)
      CW.grid_el.append(block)

      x += size
    }

    CW.grid.push(row)
    row = []

    x = 0
    y += size
  }
}

CW.random_int = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

CW.start = function () {
  CW.interval = setInterval(function () {
    let changed = false

    for (let x = 0; x < CW.grid_size; x++) {
      for (let y = 0; y < CW.grid_size; y++) {
        let num = 0
        let y2, x2

        y2 = y - 1
        if (y2 < 0) {
            y2 = CW.grid_size - 1
        }

        // North
        if (CW.grid[x][y2].alive) {
            num += 1
        }

        x2 = x - 1
        if (x2 < 0) {
            x2 = CW.grid_size - 1
        }

        // North West
        if (CW.grid[x2][y2].alive) {
            num += 1
        }

        x2 = x + 1
        if (x2 >= CW.grid_size) {
            x2 = 0
        }

        // North East
        if (CW.grid[x2][y2].alive) {
            num += 1
        }

        y2 = y + 1
        if (y2 >= CW.grid_size) {
            y2 = 0
        }

        // South
        if (CW.grid[x][y2].alive) {
            num += 1
        }

        x2 = x - 1
        if (x2 < 0) {
            x2 = CW.grid_size - 1
        }

        // South West
        if (CW.grid[x2][y2].alive) {
            num += 1
        }

        // West
        if (CW.grid[x2][y].alive) {
            num += 1
        }

        x2 = x + 1
        if (x2 >= CW.grid_size) {
            x2 = 0
        }

        // South East
        if (CW.grid[x2][y2].alive) {
            num += 1
        }

        // East
        if (CW.grid[x2][y].alive) {
            num += 1
        }

        let item = CW.grid[x][y]
        item.change_to = "nothing"

        if (item.alive) {
            if (num < 2) {
                item.change_to = "dead"
                changed = true
            } else if (num > 3) {
                item.change_to = "dead"
                changed = true
            }
        } else {
            if (num === 3) {
                item.change_to = "alive"
                changed = true
            }
        }
      }
    }

    if (!changed) {
        console.log("Game Ended!")
        clearInterval(CW.interval)
        return
    }

    CW.update()
  }, CW.speed)
}

CW.update = function () {
    for (let row of CW.grid) {
        for (let item of row) {
            if (item.change_to === "dead") {
                item.block.classList.remove("alive")
                item.alive = false
            } else if (item.change_to === "alive") {
                item.block.classList.add("alive")
                item.alive = true
            }
        }
    }
}