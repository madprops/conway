const CW = {}
CW.speed = 500
CW.grid_size = 22

CW.init = function (a) {
  let style = getComputedStyle(document.body)
  CW.size = parseInt(style.getPropertyValue("--size"))
  CW.grid_el = document.querySelector("#grid")
  CW.make_grid()
  CW.key_detection()
  CW.start()
}

CW.make_grid = function () {
  CW.grid_el.innerHTML = ""
  CW.grid = []
  let size = CW.size / CW.grid_size

  for (let y = 0; y < CW.grid_size; y++) {
    let row = []
    let row_el = document.createElement("div")
    row_el.classList.add("row")

    for (let x = 0; x < CW.grid_size; x++) {
      let item = {}
      item.y = y
      item.x = x
      item.alive = CW.random_int(0, 1) === 1

      let block = document.createElement("div")
      block.style.width = size + "px"
      block.style.height = size + "px"
      block.classList.add("block")
      
      if (item.alive) {
        block.classList.add("alive")
      }

      item.block = block
      row.push(item)
      row_el.append(block)
    }

    CW.grid.push(row)
    CW.grid_el.append(row_el)
  }
}

CW.random_int = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

CW.start = function () {
    CW.interval = setInterval(function () {
        CW.iteration()
    }, CW.speed)
}

CW.iteration = function () {
    let changed = false

    for (let x = 0; x < CW.grid_size; x++) {
      for (let y = 0; y < CW.grid_size; y++) {
        let num = 0

        let y_up = y - 1
        if (y_up < 0) {
            y_up = CW.grid_size - 1
        }

        let y_down = y + 1
        if (y_down >= CW.grid_size) {
            y_down = 0
        }

        let x_left = x - 1
        if (x_left < 0) {
            x_left = CW.grid_size - 1
        }

        let x_right = x + 1
        if (x_right >= CW.grid_size) {
            x_right = 0
        }

        // North
        if (CW.grid[x][y_up].alive) {
            num += 1
        }

        // North West
        if (CW.grid[x_left][y_up].alive) {
            num += 1
        }

        // North East
        if (CW.grid[x_right][y_up].alive) {
            num += 1
        }

        // South
        if (CW.grid[x][y_down].alive) {
            num += 1
        }

        // South West
        if (CW.grid[x_left][y_down].alive) {
            num += 1
        }

        // South East
        if (CW.grid[x_right][y_down].alive) {
            num += 1
        }

        // West
        if (CW.grid[x_left][y].alive) {
            num += 1
        }

        // East
        if (CW.grid[x_right][y].alive) {
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
        clearInterval(CW.interval)
        return
    }

    CW.update()
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

CW.key_detection = function () {
    document.addEventListener('keyup', function (e) {
        if (e.key === " ") {
            if (!CW.paused) {
                CW.paused = true
                clearInterval(CW.interval)
            } else {
                CW.iteration()
            }
        }
    })
}