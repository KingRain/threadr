import heapq
import tkinter as tk
from tkinter import messagebox, ttk
import time

class Node:
    """Node class for A* algorithm"""
    def __init__(self, x, y, g=0, h=0, parent=None):
        self.x = x
        self.y = y
        self.g = g  # Cost from start
        self.h = h  # Heuristic cost to goal
        self.f = g + h  # Total cost
        self.parent = parent
    
    def __lt__(self, other):
        return self.f < other.f
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

class MazeGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("A* Maze Solver")
        
        # Set up maze properties
        self.rows = 4
        self.cols = 5
        self.cell_size = 80
        self.padding = 10
        self.walls = set()  # Store walls as tuples of ((x1, y1), (x2, y2))
        self.start = (0, 0)  # Default start
        self.goal = (3, 4)   # Default goal
        
        # Create map of cell numbers to grid positions
        self.cell_map = {}
        self.position_map = {}
        num = 1
        for i in range(self.rows):
            for j in range(self.cols):
                self.cell_map[num] = (i, j)
                self.position_map[(i, j)] = num
                num += 1
        
        # Frame for controls
        control_frame = tk.Frame(root)
        control_frame.pack(side=tk.TOP, fill=tk.X, padx=10, pady=10)
        
        # Button to add walls
        self.wall_mode = tk.BooleanVar(value=False)
        self.wall_button = tk.Checkbutton(control_frame, text="Add/Remove Walls",
                                          variable=self.wall_mode, command=self.toggle_wall_mode)
        self.wall_button.pack(side=tk.LEFT, padx=5)
        
        # Start cell selection
        tk.Label(control_frame, text="Start:").pack(side=tk.LEFT, padx=5)
        self.start_var = tk.StringVar(value="1")
        start_combo = ttk.Combobox(control_frame, textvariable=self.start_var, 
                                   values=[str(i) for i in range(1, 21)])
        start_combo.pack(side=tk.LEFT, padx=5)
        start_combo.bind("<<ComboboxSelected>>", self.update_start)
        
        # Goal cell selection
        tk.Label(control_frame, text="Goal:").pack(side=tk.LEFT, padx=5)
        self.goal_var = tk.StringVar(value="20")
        goal_combo = ttk.Combobox(control_frame, textvariable=self.goal_var, 
                                  values=[str(i) for i in range(1, 21)])
        goal_combo.pack(side=tk.LEFT, padx=5)
        goal_combo.bind("<<ComboboxSelected>>", self.update_goal)
        
        # Speed control
        tk.Label(control_frame, text="Speed:").pack(side=tk.LEFT, padx=5)
        self.speed_var = tk.DoubleVar(value=0.3)
        speed_slider = tk.Scale(control_frame, from_=0.1, to=1.0, resolution=0.1,
                                orient=tk.HORIZONTAL, variable=self.speed_var)
        speed_slider.pack(side=tk.LEFT, padx=5)
        
        # Button to run algorithm
        self.run_button = tk.Button(control_frame, text="Run A* Algorithm", command=self.run_algorithm)
        self.run_button.pack(side=tk.LEFT, padx=10)
        
        # Button to reset
        self.reset_button = tk.Button(control_frame, text="Reset", command=self.reset_maze)
        self.reset_button.pack(side=tk.LEFT, padx=5)
        
        # Canvas for maze
        canvas_width = self.cols * self.cell_size + 2 * self.padding
        canvas_height = self.rows * self.cell_size + 2 * self.padding
        self.canvas = tk.Canvas(root, width=canvas_width, height=canvas_height, bg="white")
        self.canvas.pack(pady=10)
        
        # Status bar
        self.status_var = tk.StringVar(value="Ready. Add walls by clicking between cells.")
        status_bar = tk.Label(root, textvariable=self.status_var, bd=1, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Initialize canvas
        self.grid_lines = []
        self.draw_grid()
        
        # Mouse events for wall drawing
        self.canvas.bind("<Button-1>", self.canvas_click)
        self.last_wall_line = None
        
        # Algorithm state
        self.open_set = []
        self.closed_set = set()
        self.path = []
        self.node_states = {}  # Track visualization states
        self.running = False
        
        # Canvas items for visualization
        self.cell_rects = {}
        
        self.update_start()
        self.update_goal()
    
    def draw_grid(self):
        # Clear existing grid
        for line_id in self.grid_lines:
            self.canvas.delete(line_id)
        self.grid_lines = []
        
        # Draw horizontal and vertical grid lines
        for i in range(self.rows + 1):
            y = i * self.cell_size + self.padding
            line_id = self.canvas.create_line(
                self.padding, y, self.cols * self.cell_size + self.padding, y, width=2
            )
            self.grid_lines.append(line_id)
        
        for j in range(self.cols + 1):
            x = j * self.cell_size + self.padding
            line_id = self.canvas.create_line(
                x, self.padding, x, self.rows * self.cell_size + self.padding, width=2
            )
            self.grid_lines.append(line_id)
        
        # Add cell numbers
        for num, (i, j) in self.cell_map.items():
            x = j * self.cell_size + self.padding + self.cell_size // 2
            y = i * self.cell_size + self.padding + self.cell_size // 2
            self.canvas.create_text(x, y, text=str(num), font=("Arial", 16))
    
    def toggle_wall_mode(self):
        if self.wall_mode.get():
            self.status_var.set("Wall mode: Click between cells to add/remove walls")
        else:
            self.status_var.set("Ready")
    
    def update_start(self, event=None):
        try:
            cell_num = int(self.start_var.get())
            if 1 <= cell_num <= 20:
                self.start = self.cell_map[cell_num]
                self.draw_maze_state()
            else:
                self.start_var.set("1")
                self.start = self.cell_map[1]
        except ValueError:
            self.start_var.set("1")
            self.start = self.cell_map[1]
    
    def update_goal(self, event=None):
        try:
            cell_num = int(self.goal_var.get())
            if 1 <= cell_num <= 20:
                self.goal = self.cell_map[cell_num]
                self.draw_maze_state()
            else:
                self.goal_var.set("20")
                self.goal = self.cell_map[20]
        except ValueError:
            self.goal_var.set("20")
            self.goal = self.cell_map[20]
    
    def canvas_click(self, event):
        if not self.wall_mode.get() or self.running:
            return
        
        # Get grid coordinates from mouse position
        x, y = event.x, event.y
        
        # Check if click was near a vertical wall position
        for j in range(1, self.cols):
            wall_x = j * self.cell_size + self.padding
            if abs(x - wall_x) < 5:
                for i in range(self.rows):
                    cell_y_mid = i * self.cell_size + self.padding + self.cell_size // 2
                    if abs(y - cell_y_mid) < self.cell_size // 2:
                        # Toggle wall between (i, j-1) and (i, j)
                        wall = ((i, j-1), (i, j))
                        self.toggle_wall(wall)
                        return
        
        # Check if click was near a horizontal wall position
        for i in range(1, self.rows):
            wall_y = i * self.cell_size + self.padding
            if abs(y - wall_y) < 5:
                for j in range(self.cols):
                    cell_x_mid = j * self.cell_size + self.padding + self.cell_size // 2
                    if abs(x - cell_x_mid) < self.cell_size // 2:
                        # Toggle wall between (i-1, j) and (i, j)
                        wall = ((i-1, j), (i, j))
                        self.toggle_wall(wall)
                        return
    
    def toggle_wall(self, wall):
        cell1, cell2 = wall
        if wall in self.walls:
            self.walls.remove(wall)
            self.status_var.set(f"Removed wall between {self.position_map[cell1]} and {self.position_map[cell2]}")
        else:
            self.walls.add(wall)
            self.status_var.set(f"Added wall between {self.position_map[cell1]} and {self.position_map[cell2]}")
        
        self.draw_maze_state()
    
    def draw_maze_state(self):
        # Clear previous cell states
        for rect_id in self.cell_rects.values():
            self.canvas.delete(rect_id)
        self.cell_rects = {}
        
        # Draw start and goal cells
        start_i, start_j = self.start
        goal_i, goal_j = self.goal
        
        # Start cell in green
        x1 = start_j * self.cell_size + self.padding + 2
        y1 = start_i * self.cell_size + self.padding + 2
        x2 = (start_j + 1) * self.cell_size + self.padding - 2
        y2 = (start_i + 1) * self.cell_size + self.padding - 2
        self.cell_rects['start'] = self.canvas.create_rectangle(
            x1, y1, x2, y2, fill="light green", width=0
        )
        
        # Goal cell in red
        x1 = goal_j * self.cell_size + self.padding + 2
        y1 = goal_i * self.cell_size + self.padding + 2
        x2 = (goal_j + 1) * self.cell_size + self.padding - 2
        y2 = (goal_i + 1) * self.cell_size + self.padding - 2
        self.cell_rects['goal'] = self.canvas.create_rectangle(
            x1, y1, x2, y2, fill="light salmon", width=0
        )
        
        # Draw other cell states
        for pos, state in self.node_states.items():
            i, j = pos
            x1 = j * self.cell_size + self.padding + 2
            y1 = i * self.cell_size + self.padding + 2
            x2 = (j + 1) * self.cell_size + self.padding - 2
            y2 = (i + 1) * self.cell_size + self.padding - 2
            
            color = "white"
            if state == 'path':
                color = "magenta"
            elif state == 'current':
                color = "yellow"
            elif state == 'open':
                color = "cyan"
            elif state == 'closed':
                color = "light gray"
            
            if pos not in [self.start, self.goal]:
                rect_id = self.canvas.create_rectangle(x1, y1, x2, y2, fill=color, width=0)
                self.cell_rects[pos] = rect_id
        
        # Draw walls
        for wall in self.walls:
            (i1, j1), (i2, j2) = wall
            
            if i1 == i2:  # Vertical wall
                min_j, max_j = min(j1, j2), max(j1, j2)
                x = max_j * self.cell_size + self.padding
                y1 = i1 * self.cell_size + self.padding
                y2 = (i1 + 1) * self.cell_size + self.padding
                
                wall_id = self.canvas.create_line(x, y1, x, y2, width=4, fill="blue")
                self.cell_rects[f'wall_{i1}_{j1}_{i2}_{j2}'] = wall_id
            else:  # Horizontal wall
                min_i, max_i = min(i1, i2), max(i1, i2)
                y = max_i * self.cell_size + self.padding
                x1 = j1 * self.cell_size + self.padding
                x2 = (j1 + 1) * self.cell_size + self.padding
                
                wall_id = self.canvas.create_line(x1, y, x2, y, width=4, fill="blue")
                self.cell_rects[f'wall_{i1}_{j1}_{i2}_{j2}'] = wall_id
        
        self.canvas.update()
    
    def calculate_heuristic(self, x, y):
        """Calculate Manhattan distance heuristic"""
        return abs(x - self.goal[0]) + abs(y - self.goal[1])
    
    def get_neighbors(self, node):
        """Get valid neighbors of a node"""
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up
        
        for dx, dy in directions:
            new_x, new_y = node.x + dx, node.y + dy
            
            # Check if position is valid
            if (0 <= new_x < self.rows and 0 <= new_y < self.cols):
                # Check if there's a wall between current node and neighbor
                wall = ((node.x, node.y), (new_x, new_y))
                wall_reverse = ((new_x, new_y), (node.x, node.y))
                
                if wall not in self.walls and wall_reverse not in self.walls:
                    neighbors.append(Node(new_x, new_y))
        
        return neighbors
    
    def reconstruct_path(self, node):
        """Reconstruct path from goal to start"""
        path = []
        current = node
        while current:
            path.append((current.x, current.y))
            current = current.parent
        return path[::-1]
    
    def run_algorithm(self):
        if self.running:
            return
        
        self.running = True
        self.run_button.config(state=tk.DISABLED)
        self.wall_button.config(state=tk.DISABLED)
        
        # Reset visualization
        self.node_states = {}
        self.draw_maze_state()
        
        # Run A* algorithm
        self.status_var.set("Running A* algorithm...")
        self.root.update()
        
        # Initialize algorithm
        start_node = Node(self.start[0], self.start[1], 0, 
                         self.calculate_heuristic(self.start[0], self.start[1]))
        
        open_set = [start_node]
        closed_set = set()
        
        found_path = False
        
        while open_set:
            # Get node with lowest f score
            current = heapq.heappop(open_set)
            current_pos = (current.x, current.y)
            
            # Add to closed set
            closed_set.add(current_pos)
            
            # Update visualization state
            if current_pos not in [self.start, self.goal]:
                self.node_states[current_pos] = 'current'
                self.draw_maze_state()
            
            # Status update
            self.status_var.set(f"Exploring ({current.x}, {current.y}) - f={current.f:.1f}")
            self.root.update()
            
            # Sleep for visualization
            time.sleep(self.speed_var.get())
            
            # Check if goal reached
            if current_pos == self.goal:
                path = self.reconstruct_path(current)
                
                # Visualize path
                for pos in path:
                    if pos not in [self.start, self.goal]:
                        self.node_states[pos] = 'path'
                
                self.draw_maze_state()
                steps = len(path) - 1
                self.status_var.set(f"Path found! Length: {steps} steps")
                found_path = True
                break
            
            # Mark as visited/closed
            if current_pos not in [self.start, self.goal]:
                self.node_states[current_pos] = 'closed'
            
            # Explore neighbors
            for neighbor in self.get_neighbors(current):
                neighbor_pos = (neighbor.x, neighbor.y)
                if neighbor_pos in closed_set:
                    continue
                
                tentative_g = current.g + 1
                
                # Check if this path to neighbor is better
                existing_neighbor = None
                for node in open_set:
                    if node.x == neighbor.x and node.y == neighbor.y:
                        existing_neighbor = node
                        break
                
                if existing_neighbor is None or tentative_g < existing_neighbor.g:
                    neighbor.g = tentative_g
                    neighbor.h = self.calculate_heuristic(neighbor.x, neighbor.y)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.parent = current
                    
                    if existing_neighbor is None:
                        heapq.heappush(open_set, neighbor)
                        # Visualize open set
                        if neighbor_pos not in [self.start, self.goal]:
                            self.node_states[neighbor_pos] = 'open'
                            self.draw_maze_state()
            
            self.root.update()
        
        if not found_path:
            self.status_var.set("No path found!")
        
        # Re-enable buttons
        self.running = False
        self.run_button.config(state=tk.NORMAL)
        self.wall_button.config(state=tk.NORMAL)
    
    def reset_maze(self):
        """Reset the maze to initial state"""
        if self.running:
            return
        
        self.walls = set()
        self.node_states = {}
        self.draw_maze_state()
        self.status_var.set("Maze reset. Ready.")

def main():
    root = tk.Tk()
    app = MazeGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()


