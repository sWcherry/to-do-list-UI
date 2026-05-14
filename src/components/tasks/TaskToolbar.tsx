import { Box, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

function TaskToolbar({ onCreate, sort, setSort, filters, setFilters }: any) {

  return (
    <Box sx={{ display: "flex", gap: 2, my: 2, alignItems: "center" }}>

      <Button variant="contained" onClick={onCreate}>
        Create Task
      </Button>

      {/* Сортування */}
      <FormControl size="small" sx={{ minWidth: 90 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sort}
          label="Sort by"
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value="new">Created ↑</MenuItem>
          <MenuItem value="old">Created ↓</MenuItem>
          <MenuItem value="deadline">Deadline ↑</MenuItem>
        </Select>
      </FormControl>

      {/* Фільтрація за статусом */}
      <FormControl size="small" sx={{ minWidth: 90 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value
            })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Assigned">Assigned</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>

      {/* Фільтрація за власником */} 
      <FormControl size="small" sx={{ minWidth: 90 }}>
        <InputLabel>Owner</InputLabel>

        <Select
          value={filters.owner}
          label="Owner"
          onChange={(e) =>
            setFilters({
              ...filters,
              owner: e.target.value
            })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="self">My tasks</MenuItem>
          <MenuItem value="others">Others tasks</MenuItem>
        </Select>
      </FormControl>

    </Box>
  )
}

export default TaskToolbar