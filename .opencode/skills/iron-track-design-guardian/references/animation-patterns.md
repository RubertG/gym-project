# Animation Patterns — Voltage Industrial

Patrones de animación con **Framer Motion** para el design system Voltage Industrial.

---

## 1. Modal con Entrada/Salida

```tsx
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    return (
        <AnimatePresence onExitComplete={() => {}}>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/80"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.25,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-lg border border-primary-300/20 bg-background-800 p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
```

---

## 2. Toast con Auto-Dismiss

```tsx
import { motion } from 'framer-motion';

interface ToastProps {
    message: string;
    onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-3 border border-primary-300/20 bg-background-800 px-4 py-3"
        >
            <span className="text-white">{message}</span>
            <button
                onClick={onDismiss}
                className="text-secondary-400 hover:text-white"
            >
                ×
            </button>
        </motion.div>
    );
}
```

---

## 3. Lista con Stagger Animation

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10 },
};

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
        >
            <AnimatePresence>
                {exercises.map((exercise) => (
                    <motion.div
                        key={exercise.id}
                        variants={itemVariants}
                        exit={itemVariants.exit}
                        className="border border-secondary-700 bg-background-800 p-4"
                    >
                        {exercise.name}
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
```

---

## 4. Tabs con Transición Horizontal

```tsx
import { motion, AnimatePresence } from 'framer-motion';

interface TabsProps {
    tabs: string[];
    activeTab: number;
    onTabChange: (index: number) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <div>
            {/* Tab Headers */}
            <div className="flex border-b border-secondary-700">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(index)}
                        className={`relative px-4 py-2 ${
                            activeTab === index
                                ? 'text-primary-300'
                                : 'text-secondary-400'
                        }`}
                    >
                        {tab}
                        {activeTab === index && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-300"
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="p-4"
                >
                    {/* Tab content here */}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
```

---

## 5. Botón con Feedback de Interacción

```tsx
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export function Button({
    variant = 'primary',
    children,
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={
                variant === 'primary'
                    ? 'border-2 border-primary-300 bg-primary-300 px-6 py-3 font-bold text-black'
                    : 'border-2 border-secondary-400 bg-transparent px-6 py-3 font-bold text-secondary-200'
            }
            {...props}
        >
            {children}
        </motion.button>
    );
}
```

---

## 6. Select con Dropdown Animado

```tsx
import { motion, AnimatePresence } from 'framer-motion';

export function Select({ options, value, onChange }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border-2 border-secondary-700 bg-background-500 px-4 py-3 text-left"
            >
                {value}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute left-0 right-0 top-full z-10 mt-1 border border-secondary-700 bg-background-800"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-background-700"
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
```

---

## 7. Loading Spinner

```tsx
import { motion } from 'framer-motion';

export function Spinner() {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 border-2 border-primary-300 border-t-transparent"
        />
    );
}
```

---

## 8. Card con Hover Effect

```tsx
import { motion } from 'framer-motion';

export function RoutineCard({ routine }: { routine: Routine }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgba(204, 255, 0, 0.4)' }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer border border-primary-300/20 bg-background-800/80 p-6 backdrop-blur-md"
        >
            <h3 className="font-display text-lg font-bold text-white">
                {routine.name}
            </h3>
            <p className="mt-2 text-secondary-400">{routine.days} days</p>
        </motion.div>
    );
}
```

---

## 9. Page Transition

```tsx
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
```

---

## 10. Accessibility: Reduced Motion

```tsx
import { useReducedMotion } from 'framer-motion';

export function AnimatedComponent() {
    const prefersReduced = useReducedMotion();

    return (
        <motion.div
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
        >
            Content
        </motion.div>
    );
}
```

---

## Duraciones Recomendadas

| Tipo de Animación  | Duración       | Easing             |
| ------------------ | -------------- | ------------------ |
| Hover/Tap feedback | 0.15s          | easeOut            |
| Dropdown/Select    | 0.2s           | easeOut            |
| Fade in/out        | 0.2s–0.25s     | easeOut            |
| Modal entrada      | 0.25s          | [0.23, 1, 0.32, 1] |
| Modal salida       | 0.2s           | easeOut            |
| Tab switch         | 0.25s          | easeOut            |
| Lista stagger      | 0.05s por item | easeOut            |
| Page transition    | 0.3s           | easeOut            |

---

## Anti-patrones (NO HACER)

- ❌ `setTimeout` + `useState` para animaciones manuales
- ❌ Animar `width`, `height`, `top`, `left`, `margin`
- ❌ Usar `bounce`, `elastic`, o `spring` con stiffness alto
- ❌ Olvidar `AnimatePresence` para componentes que se desmontan
- ❌ Animaciones sin `initial`, `animate`, `exit` en modales
- ❌ Duraciones mayores a 0.6s (se siente lento)
- ❌ Múltiples animaciones simultáneas que compiten por atención
