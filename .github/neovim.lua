-- #. In the configuration of your Neovim, put this configuration to run after running the
--
-- Recommend to be running a TS LSP in Neovim as well for diagnostics.
--
-- https://github.com/BeyondMagic/whitedove
--
-- Dependencies:
-- - esbuild
-- - sass
-- - tsc
--
-- João F. © 2022 BeyondMagic - <koetemagie@gmail.com>

local whitedove_folder = ".*Projects/WhiteDove/whitedove"
local whitedove_source = whitedove_folder .. "/source"


-- #. To be used anywhere.
local function job (command)

  vim.api.nvim_command( "call jobstart('" .. command .."')" )

end

-- #. To run a job.
local function build (type)

  vim.api.nvim_command(whitedove_source)

  vim.api.nvim_create_autocmd( 'BufWritePost', {
    pattern = '<buffer>',
    callback = function ()
      job( './build.sh ' .. type )
    end,
  })

end

-- #. This will add in the NVim system.
vim.filetype.add({

  -- ...

  pattern = {

    -- ...

    -- NWrite - WhiteDove
    [ whitedove_folder .. "/html/.*"] = function()
      build('html')
    end,
    [whitedove_folder .. "/scss/.*"] = function()
      build('scss')
    end,
    [whitedove_folder .. "/ts/.*"] = function()
      build('ts')
    end,

    -- ...

  },

  -- ...

  filename = {

    -- ...

    -- For Typescript projects.
    ['tsconfig.json'] = 'json5',

    -- ...

  }

  -- ...

})

-- #. After this, just run `neu run` and develop the application!
