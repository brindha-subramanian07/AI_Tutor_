// Mock Data & Preloaded Curriculum for AI Tutor

export const CURRENT_STUDENT = {
  name: "Dheepana K.N.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  email: "dheepana.kn@college.edu",
  program: "B.Tech AI & Data Science",
  semester: "Semester 6",
  streak: 7,
  topicsCompleted: 24,
  quizzesTaken: 18,
  averageScore: 86,
  hoursLearned: 38.5,
  overallProgress: 72,
  department: "Artificial Intelligence & Data Science",
  college: "Faculty of Engineering & Technology",
};

export const PRESET_TOPICS = {
  "loops-in-python": {
    id: "loops-in-python",
    title: "Loops in Python: For & While Mechanisms",
    category: "Programming & Python",
    difficulty: "Beginner",
    duration: "12 mins",
    summary: "Master iterative execution in Python, internal pointer mechanics of iterables, range generators, and avoiding infinite loops.",
    slides: [
      {
        id: 1,
        title: "Introduction to Iteration",
        subtitle: "Why execute code repeatedly?",
        diagram: "iteration-flow",
        narration: "Welcome to this AI-guided visual lecture. In computer programming, repetition is essential. Instead of writing code twenty times, a loop allows our computer to execute a block of instructions automatically until a termination condition is satisfied.",
        code: `# Without loops:
print("Processing record 1")
print("Processing record 2")

# With a loop:
for i in range(1, 100):
    print(f"Processing record {i}")`,
        visualNotes: ["Automatic iteration over collections", "Prevents code duplication (DRY principle)", "Controlled by clear stop criteria"]
      },
      {
        id: 2,
        title: "The 'for' Loop & The Iterable Protocol",
        subtitle: "How Python traverses sequences under the hood",
        diagram: "for-loop-cycle",
        narration: "Unlike languages like C or Java where you manage index counters manually, Python's for loop operates directly on iterables using the iterator protocol. It requests the next element from the iterator until StopIteration is raised.",
        code: `fruits = ["Autumn Apple", "Hazelnut", "Cinnamon"]
for item in fruits:
    print(f"Baking with {item}")`,
        visualNotes: ["Iterates directly over elements", "Works on lists, tuples, dictionaries, and strings", "Internal iterator handles index pointers safely"]
      },
      {
        id: 3,
        title: "The 'while' Loop & Guard Conditions",
        subtitle: "Conditional repetition based on truth values",
        diagram: "while-condition",
        narration: "A while loop runs as long as its condition evaluates to True. It is ideal when you don't know beforehand how many iterations are needed, such as reading network streams or awaiting user confirmation.",
        code: `battery_level = 100
while battery_level > 20:
    print(f"AI Model Running... Battery at {battery_level}%")
    battery_level -= 25
print("System entering low-power hibernation.")`,
        visualNotes: ["Evaluates boolean condition before each pass", "Must modify state inside loop to prevent infinite loops", "Can use break and continue to control loop flow"]
      },
      {
        id: 4,
        title: "Loop Control: break, continue & else",
        subtitle: "Fine-grained control of execution flow",
        diagram: "break-continue",
        narration: "Python offers unique keywords: 'break' terminates the loop immediately, 'continue' skips to the next iteration, and Python even has a unique 'else' clause that triggers only if the loop wasn't interrupted by a break.",
        code: `for num in [2, 3, 5, 7, 9]:
    if num % 2 == 0:
        print(f"Found even number: {num}")
        break
else:
    print("No even numbers found in search space")`,
        visualNotes: ["break: Early exit upon condition match", "continue: Skips current iteration cycle", "else clause: Executes when loop finishes naturally"]
      }
    ],
    keyConcepts: [
      { term: "Iterable", definition: "Any Python object capable of returning its members one at a time (e.g., list, str, dict)." },
      { term: "range() Generator", definition: "Memory-efficient sequence generator that yields integers on-demand without storing them all in RAM." },
      { term: "Infinite Loop", definition: "A loop whose termination condition is never reached, causing the program to freeze." },
      { term: "List Comprehension", definition: "A concise syntax for creating new lists by evaluating an expression over an iterable." }
    ],
    codeExamples: [
      {
        title: "Filtering with List Comprehensions",
        lang: "python",
        code: `# Standard Loop:
filtered_grades = []
for score in [88, 92, 59, 74, 95]:
    if score >= 75:
        filtered_grades.append(score)

# Modern Pythonic idiom:
filtered_grades = [score for score in [88, 92, 59, 74, 95] if score >= 75]`
      },
      {
        title: "Safe While Loop with Sentinel Break",
        lang: "python",
        code: `max_attempts = 3
attempts = 0

while attempts < max_attempts:
    attempts += 1
    success = simulate_network_call()
    if success:
        print("Connected on attempt", attempts)
        break
else:
    print("Connection failed after max retries")`
      }
    ],
    practicalTask: {
      title: "Task: Implement Fibonacci Sequence Generator",
      instructions: "Write a function `fibonacci(n)` that returns the first `n` numbers of the Fibonacci sequence using a loop. Make sure your loop handles n=0, n=1, and n>1.",
      starterCode: `def fibonacci(n):\n    if n <= 0:\n        return []\n    if n == 1:\n        return [0]\n    \n    seq = [0, 1]\n    # Your loop here:\n    for i in range(2, n):\n        seq.append(seq[-1] + seq[-2])\n        \n    return seq\n\n# Test your code\nprint(fibonacci(7))`,
      expectedOutput: "[0, 1, 1, 2, 3, 5, 8]",
      solution: `def fibonacci(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    seq = [0, 1]\n    for i in range(2, n):\n        seq.append(seq[-1] + seq[-2])\n    return seq`
    },
    quizQuestions: [
      {
        id: 1,
        question: "What will the following code output: `for i in range(1, 5): print(i, end=' ')`?",
        options: ["1 2 3 4 5", "1 2 3 4", "0 1 2 3 4", "1 5"],
        correctIndex: 1,
        subtopic: "Range Bounds & Step Mechanics",
        explanation: "`range(start, stop)` stops strictly before the stop value. Therefore `range(1, 5)` yields 1, 2, 3, and 4."
      },
      {
        id: 2,
        question: "What happens if a while loop condition remains `True` and no `break` statement is encountered?",
        options: [
          "Python automatically halts after 1000 iterations",
          "The program enters an infinite loop and may consume high CPU",
          "A SyntaxError is raised by the interpreter",
          "The loop converts itself into a generator"
        ],
        correctIndex: 1,
        subtopic: "Termination Conditions & Infinite Loops",
        explanation: "Python will not automatically interrupt an infinite while loop unless interrupted by the OS or keyboard interrupt (Ctrl+C)."
      },
      {
        id: 3,
        question: "What does the `continue` statement do inside a loop body?",
        options: [
          "Exits the loop and resumes outer execution",
          "Restarts the entire loop from iteration zero",
          "Skips the remainder of the current iteration and jumps to the next cycle",
          "Pauses execution for 1 second"
        ],
        correctIndex: 2,
        subtopic: "Loop Flow Control (break & continue)",
        explanation: "`continue` immediately ends the current iteration pass and proceeds to the next item or evaluation."
      },
      {
        id: 4,
        question: "When does the `else` block of a Python `for` or `while` loop execute?",
        options: [
          "Every single time the loop executes",
          "Only when an exception or error occurs inside the loop",
          "Only if the loop finishes naturally without being terminated by a `break` statement",
          "Whenever the loop condition is initially false"
        ],
        correctIndex: 2,
        subtopic: "Loop Else Clause Execution",
        explanation: "Python loop `else` blocks run upon regular exhaustion of the loop, but are skipped if `break` is triggered."
      },
      {
        id: 5,
        question: "Which of the following is the most memory-efficient way to iterate over 1,000,000 numbers in Python 3?",
        options: [
          "for i in [x for x in range(1000000)]",
          "for i in range(1000000)",
          "for i in list(range(1000000))",
          "for i in tuple(range(1000000))"
        ],
        correctIndex: 1,
        subtopic: "Memory & Iterator Efficiency",
        explanation: "In Python 3, `range()` returns an immutable sequence object that computes elements lazily on demand using O(1) memory."
      }
    ]
  },

  "newtons-third-law": {
    id: "newtons-third-law",
    title: "Newton's Third Law: Action & Reaction Dynamics",
    category: "Physics & Mechanics",
    difficulty: "Intermediate",
    duration: "15 mins",
    summary: "Discover why forces always occur in matched pairs, rocket propulsion mechanics, and the common pitfall of balanced forces.",
    slides: [
      {
        id: 1,
        title: "The Law of Reciprocal Interaction",
        subtitle: "Forces never exist in isolation",
        diagram: "action-reaction-vectors",
        narration: "Newton's Third Law states that whenever one object exerts a force on a second object, the second object exerts an equal in magnitude and opposite in direction force back on the first. Mathematically, Force of A on B equals negative Force of B on A.",
        code: `# Vector Formulation:
# F_AB = -F_BA
# |F_AB| == |F_BA|
# Direction(F_AB) == Opposite(Direction(F_BA))`,
        visualNotes: ["Forces always occur in matched pairs", "Both forces act simultaneously", "The two forces act on DIFFERENT bodies"]
      },
      {
        id: 2,
        title: "Crucial Insight: Why Don't Action & Reaction Cancel Out?",
        subtitle: "The most common conceptual confusion in mechanics",
        diagram: "free-body-separation",
        narration: "A frequent confusion is thinking action and reaction cancel each other out to zero acceleration. They never cancel because they act on two different bodies! When drawing a free-body diagram for Object A, you only count forces acting ON Object A.",
        code: `# Swimmer pushing pool wall:
# Force 1: Swimmer's feet push wall (Wall receives force)
# Force 2: Wall pushes swimmer forward (Swimmer receives force -> accelerates!)`,
        visualNotes: ["Action force acts on Object B", "Reaction force acts on Object A", "Net force on a single object is non-zero, causing acceleration"]
      },
      {
        id: 3,
        title: "Rocket Propulsion in Space Vacuum",
        subtitle: "Demonstrating Newton's 3rd law without external air",
        diagram: "rocket-thrust",
        narration: "How does a rocket propel itself in the vacuum of deep space where there is no air to push against? The rocket engine forces hot exhaust gases backward with massive force; the expelled gases exert an equal and opposite forward reaction force on the rocket.",
        code: `# Conservation of Momentum & Thrust:
# Thrust = m_dot * v_exhaust + (p_exit - p_ambient) * A_exit
# m_rocket * delta(v_rocket) = - m_fuel * delta(v_exhaust)`,
        visualNotes: ["Does not push against surrounding air", "Propels by accelerating its own mass outward", "Governed by Tsiolkovsky Rocket Equation"]
      }
    ],
    keyConcepts: [
      { term: "Action-Reaction Pair", definition: "Two simultaneous forces of identical magnitude, opposite direction, acting on two different bodies." },
      { term: "Free-Body Diagram", definition: "A physical diagram showing only the external forces acting on one chosen object." },
      { term: "Normal Force", definition: "The perpendicular contact force exerted by a surface in reaction to an object pressing against it." }
    ],
    codeExamples: [
      {
        title: "Simulating Recoil Acceleration in Python",
        lang: "python",
        code: `def calculate_recoil(mass_cannon_kg, mass_ball_kg, velocity_ball_mps):
    # Momentum is conserved: m1*v1 + m2*v2 = 0
    # v_recoil = - (m_ball * v_ball) / m_cannon
    recoil_velocity = - (mass_ball_kg * velocity_ball_mps) / mass_cannon_kg
    return round(recoil_velocity, 2)

print("Recoil velocity:", calculate_recoil(800, 5, 240), "m/s")`
      }
    ],
    practicalTask: {
      title: "Task: Free Body Equilibrium Calculator",
      instructions: "Calculate the normal force exerted by a tabletop on a resting book of mass `m` under gravity `g=9.8` with an additional downward hand pressing force `F_push`.",
      starterCode: `def normal_force(mass_kg, push_force_n):\n    g = 9.8\n    # Normal force must balance weight + downward push\n    # N = (m * g) + F_push\n    return round((mass_kg * g) + push_force_n, 2)\n\nprint(normal_force(2.5, 15.0))`,
      expectedOutput: "39.5",
      solution: `def normal_force(mass_kg, push_force_n):\n    return round((mass_kg * 9.8) + push_force_n, 2)`
    },
    quizQuestions: [
      {
        id: 1,
        question: "Why do action and reaction forces NOT cancel each other out to produce zero net force?",
        options: [
          "Because they act at slightly different times",
          "Because one force is always slightly larger than the other",
          "Because they act on two distinct objects, not on the same object",
          "Because friction absorbs the reaction force"
        ],
        correctIndex: 2,
        subtopic: "Action-Reaction Independent Bodies Mechanics",
        explanation: "Newton's 3rd law forces act on different bodies. You can only add forces together to find net force if they act on the same body."
      },
      {
        id: 2,
        question: "A heavy truck collides head-on with a small compact car. Which vehicle experiences the greater impact force?",
        options: [
          "The truck experiences a larger force due to its larger mass",
          "The car experiences a larger force because it sustains more damage",
          "Both vehicles experience exactly the same magnitude of impact force",
          "The force depends on which vehicle was moving faster"
        ],
        correctIndex: 2,
        subtopic: "Collision Dynamics & Force Reciprocity",
        explanation: "By Newton's Third Law, the force of the truck on the car is exactly equal in magnitude to the force of the car on the truck. The car experiences higher acceleration and damage because of its lower mass (F = ma)."
      },
      {
        id: 3,
        question: "How does a rocket accelerate in the complete vacuum of outer space?",
        options: [
          "By pushing against the gravitational waves of distant stars",
          "By expelling exhaust gas backward, receiving an equal forward reaction force",
          "It uses solar radiation pressure to glide without reaction mass",
          "Rockets cannot accelerate once they leave Earth's atmosphere"
        ],
        correctIndex: 1,
        subtopic: "Rocket Propulsion in Space Vacuum",
        explanation: "Rockets carry both fuel and oxidizer; expelling high-velocity gas mass backward creates the forward thrust reaction force."
      }
    ]
  },

  "binary-search-trees": {
    id: "binary-search-trees",
    title: "Binary Search Trees: Structure & Search Complexity",
    category: "Data Structures & Algorithms",
    difficulty: "Advanced",
    duration: "18 mins",
    summary: "Understand the BST invariant property, recursive insertion, deletion edge cases, and AVL balancing.",
    slides: [
      {
        id: 1,
        title: "The BST Invariant Property",
        subtitle: "Ordered hierarchical branching",
        diagram: "bst-nodes",
        narration: "A Binary Search Tree is a node-based binary tree data structure where each node satisfies the BST invariant: every key in the left subtree is strictly less than the node's key, and every key in the right subtree is strictly greater.",
        code: `class BSTNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None`,
        visualNotes: ["Left Subtree < Root < Right Subtree", "Guarantees ordered traversal", "Average lookup complexity is O(log n)"]
      },
      {
        id: 2,
        title: "In-Order Traversal & Sorting",
        subtitle: "Extracting sorted elements in linear time",
        diagram: "inorder-walk",
        narration: "A beautiful property of Binary Search Trees is that an in-order traversal—visiting left child, then current node, then right child—yields elements in strictly ascending sorted order in O(n) time.",
        code: `def inorder_traversal(node):
    if not node:
        return []
    return inorder_traversal(node.left) + [node.key] + inorder_traversal(node.right)`,
        visualNotes: ["Left -> Root -> Right yields sorted ascending order", "O(n) time complexity", "Requires recursion stack depth proportional to tree height"]
      }
    ],
    keyConcepts: [
      { term: "BST Invariant", definition: "Left children < Parent < Right children throughout all descendants." },
      { term: "Tree Height", definition: "Length of the longest downward path from root to leaf, dictating search time." },
      { term: "Degenerate Tree", definition: "A tree where each parent has only one child, degrading performance to O(n) linked list." }
    ],
    codeExamples: [
      {
        title: "Recursive BST Search",
        lang: "python",
        code: `def search_bst(root, target):
    if not root or root.key == target:
        return root
    if target < root.key:
        return search_bst(root.left, target)
    return search_bst(root.right, target)`
      }
    ],
    practicalTask: {
      title: "Task: BST Node Insertion",
      instructions: "Implement recursive BST insertion to add a new key while maintaining the BST invariant.",
      starterCode: `def insert(root, val):\n    if not root:\n        return {"val": val, "left": None, "right": None}\n    if val < root["val"]:\n        root["left"] = insert(root["left"], val)\n    else:\n        root["right"] = insert(root["right"], val)\n    return root\n\n# Test with 10, 5, 15\ntree = None\nfor v in [10, 5, 15]:\n    tree = insert(tree, v)\nprint("Root:", tree["val"], "Left:", tree["left"]["val"], "Right:", tree["right"]["val"])`,
      expectedOutput: "Root: 10 Left: 5 Right: 15",
      solution: `def insert(root, val):\n    if not root: return {"val": val, "left": None, "right": None}\n    if val < root["val"]: root["left"] = insert(root["left"], val)\n    else: root["right"] = insert(root["right"], val)\n    return root`
    },
    quizQuestions: [
      {
        id: 1,
        question: "What is the worst-case time complexity of searching a key in an un-balanced Binary Search Tree with N nodes?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctIndex: 2,
        subtopic: "Tree Balancing & Skew Degeneracy",
        explanation: "If nodes are inserted in sorted order (e.g. 1, 2, 3, 4, 5), the tree degrades into a straight line (skewed tree), making search O(N)."
      },
      {
        id: 2,
        question: "Which traversal of a Binary Search Tree produces elements in strictly ascending sorted order?",
        options: ["Pre-order traversal", "Post-order traversal", "In-order traversal", "Level-order BFS traversal"],
        correctIndex: 2,
        subtopic: "In-Order Traversal & Sorting",
        explanation: "In-order traversal visits (Left, Root, Right), which mathematically retrieves values in ascending order."
      },
      {
        id: 3,
        question: "What invariant must hold for every node in a valid Binary Search Tree?",
        options: [
          "All nodes in left subtree < Root < All nodes in right subtree",
          "Left child is always even and right child is odd",
          "Tree must always have 2^k nodes",
          "Leaves can only exist at the deepest level"
        ],
        correctIndex: 0,
        subtopic: "BST Invariant & Ordering Properties",
        explanation: "The BST invariant requires all keys in the left subtree to be strictly smaller than the node, and right subtree keys to be greater."
      }
    ]
  },

  "python-functions": {
    id: "python-functions",
    title: "Python Function Arguments & Parameter Mechanics",
    category: "Programming & Python",
    difficulty: "Intermediate",
    duration: "14 mins",
    summary: "Master positional arguments, keyword arguments, *args, **kwargs, default argument evaluation traps, and unpacking mechanics.",
    slides: [
      {
        id: 1,
        title: "Positional vs Keyword Arguments",
        subtitle: "How parameters map to call signatures",
        diagram: "args-mapping",
        narration: "In Python, parameters can be passed positionally or by keyword. Understanding parameter order and keyword-only boundaries is fundamental to writing clean APIs.",
        code: `def create_user(username, role="student", *, verify=True):
    return {"user": username, "role": role, "verified": verify}

# Positional and keyword invocation:
u1 = create_user("alex", role="tutor")`,
        visualNotes: ["Positional arguments come first", "Default values are evaluated once at definition time", "Keyword-only parameters follow * or *args"]
      },
      {
        id: 2,
        title: "Variadic *args & **kwargs Protocol",
        subtitle: "Accepting dynamic arbitrary arguments safely",
        diagram: "variadic-unpacking",
        narration: "*args captures arbitrary positional arguments into an immutable tuple, while **kwargs captures arbitrary keyword arguments into a mutable dictionary.",
        code: `def log_event(event_name, *args, **kwargs):
    print(f"[{event_name}] Positional:", args)
    print(f"[{event_name}] Key-values:", kwargs)

log_event("LOGIN", 101, "Chrome", ip="192.168.1.1", status="OK")`,
        visualNotes: ["*args packs into a tuple", "**kwargs packs into a dict", "Allows flexible wrappers and decorator signatures"]
      }
    ],
    keyConcepts: [
      { term: "*args", definition: "Packs extra positional arguments into a tuple." },
      { term: "**kwargs", definition: "Packs extra keyword arguments into a dictionary." },
      { term: "Default Argument Trap", definition: "Mutable objects as default arguments persist across function calls." }
    ],
    codeExamples: [
      {
        title: "Safe Default Argument Pattern",
        lang: "python",
        code: `# BAD: def append_to(item, target=[]):
# GOOD:
def append_to(item, target=None):
    if target is None:
        target = []
    target.append(item)
    return target`
      }
    ],
    practicalTask: {
      title: "Task: Implement Dynamic Query Filter",
      instructions: "Write a function `filter_data(*predicates, **exact_matches)` that checks item validity.",
      starterCode: `def filter_record(record, **criteria):\n    return all(record.get(k) == v for k, v in criteria.items())\n\nprint(filter_record({"role": "admin", "active": True}, role="admin"))`,
      expectedOutput: "True",
      solution: `def filter_record(record, **criteria):\n    return all(record.get(k) == v for k, v in criteria.items())`
    },
    quizQuestions: [
      {
        id: 1,
        question: "What data structure does `*args` pack variadic positional arguments into?",
        options: ["List", "Tuple", "Dictionary", "Set"],
        correctIndex: 1,
        subtopic: "Variadic Positional *args Mechanics",
        explanation: "`*args` collects positional arguments into an immutable tuple object."
      },
      {
        id: 2,
        question: "What does `**kwargs` collect when passed into a function?",
        options: ["A list of variable names", "A dictionary of keyword name-value pairs", "A generator stream", "A tuple of values"],
        correctIndex: 1,
        subtopic: "Variadic Keyword **kwargs Mechanics",
        explanation: "`**kwargs` captures arbitrary named keyword parameters as key-value pairs in a standard Python dictionary."
      },
      {
        id: 3,
        question: "Why is defining `def add_item(val, items=[])` considered a dangerous antipattern in Python?",
        options: [
          "It raises a compile-time SyntaxError",
          "The default list is created once at function definition time and shared across subsequent calls",
          "Python disables lists as default parameter values",
          "Memory leaks occur because garbage collection cannot free empty lists"
        ],
        correctIndex: 1,
        subtopic: "Default Parameter Evaluation & Mutability",
        explanation: "Python evaluates default parameter expressions once when the function is defined, so a mutable default list persists and accumulates state across calls."
      },
      {
        id: 4,
        question: "In Python parameter declarations, which order is syntactically valid?",
        options: [
          "def f(*args, pos1, **kwargs)",
          "def f(pos1, default_arg=1, *args, **kwargs)",
          "def f(**kwargs, *args, pos1)",
          "def f(default_arg=1, pos1)"
        ],
        correctIndex: 1,
        subtopic: "Parameter Ordering & Keyword-Only Rules",
        explanation: "The standard order is: standard positional parameters, default parameters, *args, keyword-only parameters, and finally **kwargs."
      },
      {
        id: 5,
        question: "What does `func(*[1, 2, 3])` do at invocation time?",
        options: [
          "Unpacks the elements of the list as individual positional arguments to func",
          "Passes the list as a single tuple",
          "Multiplies the return value by the length of the list",
          "Creates a pointer reference in CPython"
        ],
        correctIndex: 0,
        subtopic: "Argument Unpacking Protocol",
        explanation: "The single `*` operator during function invocation unpacks the iterable sequence into individual positional arguments."
      }
    ]
  }
};

export const RECENT_STUDY_SESSIONS = [
  {
    topicId: "loops-in-python",
    title: "Loops in Python: For & While Mechanisms",
    category: "Programming & Python",
    progress: 85,
    lastAccessed: "2 hours ago",
    badge: "In Progress",
    timeSpent: "24m",
    nextStep: "Practice Task & Quiz"
  },
  {
    topicId: "newtons-third-law",
    title: "Newton's Third Law: Action & Reaction Dynamics",
    category: "Physics & Mechanics",
    progress: 100,
    lastAccessed: "Yesterday",
    badge: "Completed",
    timeSpent: "35m",
    nextStep: "Review Evaluation"
  },
  {
    topicId: "binary-search-trees",
    title: "Binary Search Trees: Structure & Search Complexity",
    category: "Data Structures",
    progress: 40,
    lastAccessed: "3 days ago",
    badge: "In Progress",
    timeSpent: "15m",
    nextStep: "Watch Lecture Part 2"
  }
];

export const AI_RECOMMENDATIONS = [
  {
    id: "rec-1",
    title: "Python Function Arguments & *args, **kwargs",
    category: "Programming & Python",
    difficulty: "Intermediate",
    timeEst: "14 mins",
    matchScore: 96,
    reason: "Recommended because your recent quiz shows difficulty with function parameters and loop scope isolation.",
    relatedWeakConcept: "Variable Scope inside Iterative Blocks",
    urgency: "High Priority"
  },
  {
    id: "rec-2",
    title: "Free Body Diagram Vector Resolution",
    category: "Physics & Mechanics",
    difficulty: "Intermediate",
    timeEst: "18 mins",
    matchScore: 91,
    reason: "Recommended to reinforce normal force calculation on inclined planes after Newton's Third Law assessment.",
    relatedWeakConcept: "Action-Reaction Pair Separation",
    urgency: "Medium Priority"
  },
  {
    id: "rec-3",
    title: "Balanced AVL Trees & Rotations",
    category: "Data Structures",
    difficulty: "Advanced",
    timeEst: "22 mins",
    matchScore: 88,
    reason: "Recommended following your BST exploration to prevent worst-case O(N) degradation with auto-balancing.",
    relatedWeakConcept: "Tree Height & Skewed Branching",
    urgency: "Recommended"
  },
  {
    id: "rec-4",
    title: "Backpropagation & Chain Rule in Deep Learning",
    category: "Machine Learning & AI",
    difficulty: "Advanced",
    timeEst: "25 mins",
    matchScore: 85,
    reason: "Directly aligns with your B.Tech AI & Data Science semester curriculum and gradient calculus goals.",
    relatedWeakConcept: "Partial Derivatives & Loss Gradients",
    urgency: "Curriculum Target"
  }
];

export const LEARNING_ROOMS = [
  {
    id: "room-py204",
    name: "CS204: Python & Algorithmic Thinking",
    code: "PY-204",
    description: "Official collaborative classroom for second-year Python learners and lab assignments.",
    membersCount: 34,
    activeDoubts: 5,
    instructor: "Dr. A. Sundararajan",
    members: [
      { name: "Dheepana K.N.", role: "Student", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" },
      { name: "Kavitha R.", role: "Student", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" },
      { name: "Arun Kumar", role: "Teaching Assistant", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
      { name: "Sneha Patel", role: "Student", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120" }
    ],
    doubts: [
      {
        id: "d-1",
        author: "Sneha Patel",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
        timestamp: "25 mins ago",
        title: "Why does modifying a list while iterating over it in a for loop cause skipped elements?",
        content: "When I write `for item in my_list: if condition: my_list.remove(item)`, some elements are skipped without being checked. Why does this happen and what's the safe way?",
        tags: ["Python", "Loops", "List Mutation"],
        upvotes: 14,
        solved: true,
        aiAnswer: {
          tutor: "AI Tutor (Verified)",
          timestamp: "23 mins ago",
          explanation: "In Python, a `for` loop tracks iteration position using an internal integer index counter (0, 1, 2...). When you remove an item, all subsequent items shift left by one position. The loop index then advances to the next position, inadvertently jumping over the shifted element.\n\nSafe alternatives:\n1. Iterate over a shallow copy: `for item in my_list[:]:`\n2. Use a clean list comprehension: `my_list = [item for item in my_list if not condition]`",
          codeSnippet: `# Safe pattern:
items = [1, 2, 3, 4, 5]
# List comprehension produces clean filtered copy without index mutation
cleaned = [x for x in items if x % 2 != 0]`
        },
        replies: [
          {
            author: "Arun Kumar (TA)",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
            timestamp: "18 mins ago",
            content: "Exactly what AI Tutor highlighted. Never mutate sequence length during active iteration. Always use list comprehensions or iterate over a slice."
          }
        ]
      },
      {
        id: "d-2",
        author: "Kavitha R.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        timestamp: "2 hours ago",
        title: "Difference between `range(len(arr))` vs `enumerate(arr)`?",
        content: "Our lab manual uses `range(len(arr))` in several places, but the AI Tutor recommended `enumerate()`. Is there any performance difference?",
        tags: ["Best Practices", "Iterables"],
        upvotes: 9,
        solved: true,
        aiAnswer: {
          tutor: "AI Tutor (Verified)",
          timestamp: "1 hour ago",
          explanation: "`enumerate(arr)` is both more readable and slightly faster in CPython because it retrieves the index and value directly in one C-level tuple unpack, rather than requiring an explicit secondary `arr[i]` subscript lookup on every iteration pass.",
          codeSnippet: `# Pythonic and fast:
for idx, val in enumerate(arr):
    print(idx, val)`
        },
        replies: []
      }
    ]
  },
  {
    id: "room-ai501",
    name: "AI & Neural Networks Research Pod",
    code: "AI-501",
    description: "Deep learning fundamentals, PyTorch autograd, loss functions, and model optimization.",
    membersCount: 28,
    activeDoubts: 8,
    instructor: "Prof. Vikram Mohan",
    members: [
      { name: "Dheepana K.N.", role: "Student", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" },
      { name: "Rahul S.", role: "Student", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" }
    ],
    doubts: [
      {
        id: "d-ai-1",
        author: "Rahul S.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        timestamp: "3 hours ago",
        title: "Vanishing gradient problem with Sigmoid vs ReLU?",
        content: "Why does the gradient vanish in deep neural networks when using Sigmoid activation instead of ReLU?",
        tags: ["Deep Learning", "Gradients", "Activations"],
        upvotes: 19,
        solved: true,
        aiAnswer: {
          tutor: "AI Tutor (Verified)",
          timestamp: "2 hours ago",
          explanation: "The derivative of the standard Sigmoid function peaks at only 0.25 (when x=0) and approaches 0 as |x| grows large. When backpropagating through L layers, the chain rule multiplies these derivatives together: (0.25)^L decays exponentially to zero! ReLU has a constant derivative of 1 for positive inputs, maintaining gradient flow.",
          codeSnippet: `# Sigmoid derivative: s'(x) = s(x) * (1 - s(x)) <= 0.25
# ReLU derivative: 1 if x > 0 else 0`
        },
        replies: []
      }
    ]
  },
  {
    id: "room-phy102",
    name: "Applied Physics & Dynamics",
    code: "PHY-102",
    description: "Classical Newtonian mechanics, momentum conservation, and engineering dynamics.",
    membersCount: 19,
    activeDoubts: 2,
    instructor: "Dr. Meenakshi S.",
    members: [
      { name: "Dheepana K.N.", role: "Student", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" }
    ],
    doubts: []
  }
];

export const PROGRESS_ANALYTICS = {
  overallPercentage: 74,
  streakDays: 7,
  topicsMastered: 18,
  topicsInProgress: 6,
  totalQuizAttempts: 24,
  averageAccuracy: 87.5,
  strongAreas: [
    { subject: "Python Syntax & Flow Control", mastery: 94, status: "Mastered" },
    { subject: "Newtonian Mechanics", mastery: 91, status: "Mastered" },
    { subject: "Algorithm Time Complexity (Big O)", mastery: 85, status: "Proficient" },
    { subject: "Linear Search & Sorting Basics", mastery: 88, status: "Proficient" }
  ],
  weakAreas: [
    { subject: "Loop Termination & Sentinel Guards", mastery: 62, status: "Needs Practice", tip: "Review while-loop break conditions & off-by-one errors" },
    { subject: "BST Node Deletion (Two-Child Case)", mastery: 58, status: "Attention Required", tip: "Practice finding in-order successor replacements" },
    { subject: "Normal Force Vector Decomposition", mastery: 64, status: "Needs Practice", tip: "Decompose perpendicular vs parallel forces on ramps" }
  ],
  weeklyActivity: [
    { day: "Mon", hours: 2.5, quizzes: 3, score: 90 },
    { day: "Tue", hours: 3.0, quizzes: 4, score: 85 },
    { day: "Wed", hours: 1.8, quizzes: 2, score: 92 },
    { day: "Thu", hours: 4.2, quizzes: 5, score: 88 },
    { day: "Fri", hours: 3.5, quizzes: 4, score: 84 },
    { day: "Sat", hours: 5.0, quizzes: 6, score: 94 },
    { day: "Sun", hours: 2.8, quizzes: 3, score: 89 }
  ],
  recentQuizScores: [
    { topic: "Newton's Third Law", score: 100, date: "Yesterday", status: "Perfect" },
    { topic: "Python Loops Basics", score: 80, date: "2 days ago", status: "Good" },
    { topic: "Binary Search Trees", score: 60, date: "4 days ago", status: "Needs Review" },
    { topic: "Array Manipulation in Python", score: 95, date: "5 days ago", status: "Excellent" }
  ]
};
