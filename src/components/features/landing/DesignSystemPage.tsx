import { useState } from 'react'
import {
    Button,
    Card,
    Input,
    GlowEffect,
    Checkbox,
    Switch,
    Avatar,
    Textarea,
    Select,
    Tabs,
    ToastContainer,
    useToast,
    Label,
    Spinner,
    Badge,
    Modal,
} from '@/components'

export function DesignSystemPage() {
    const [checkbox1, setCheckbox1] = useState(false)
    const [checkbox2, setCheckbox2] = useState(true)
    const [switch1, setSwitch1] = useState(false)
    const [switch2, setSwitch2] = useState(true)
    const [selectValue, setSelectValue] = useState('')
    const [activeTab, setActiveTab] = useState('rutinas')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg'>('md')
    const { toasts, addToast, removeToast } = useToast()

    const handleOpenModal = (size: 'sm' | 'md' | 'lg') => {
        setModalSize(size)
        setModalOpen(true)
    }

    const tabContent: Record<string, React.ReactNode> = {
        rutinas: (
            <div className="space-y-4">
                <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                    Mis Rutinas
                </h4>
                <p className="text-word-200">
                    Aqui se muestran tus rutinas de entrenamiento
                    personalizadas. Puedes crear, editar y eliminar rutinas
                    segun tus objetivos.
                </p>
                <div className="flex gap-2">
                    <Badge variant="primary">Fuerza</Badge>
                    <Badge variant="success">Activa</Badge>
                </div>
            </div>
        ),
        ejercicios: (
            <div className="space-y-4">
                <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                    Biblioteca de Ejercicios
                </h4>
                <p className="text-word-200">
                    Explora nuestra biblioteca de ejercicios con videos,
                    descripciones y consejos de ejecucion correcta.
                </p>
                <div className="flex gap-2">
                    <Badge variant="warning">120 disponibles</Badge>
                </div>
            </div>
        ),
        historial: (
            <div className="space-y-4">
                <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                    Historial de Entrenamientos
                </h4>
                <p className="text-word-200">
                    Revisa tu progreso a lo largo del tiempo. Filtra por fecha,
                    rutina o grupo muscular.
                </p>
                <div className="flex gap-2">
                    <Badge variant="danger">3 sesiones esta semana</Badge>
                </div>
            </div>
        ),
    }

    return (
        <main className="bg-background-900 min-h-screen p-4 md:p-6 lg:p-8">
            {/* Nav */}
            <nav className="border-secondary-800 mb-6 flex gap-4 border-b pb-4 md:mb-8">
                <a
                    href="/design-system"
                    className="text-word-400 hover:text-word-200 font-mono text-xs tracking-widest uppercase transition-colors md:text-sm"
                >
                    Paleta
                </a>
                <a
                    href="/design-system/components"
                    className="text-primary-400 font-mono text-xs tracking-widest uppercase md:text-sm"
                >
                    Componentes
                </a>
            </nav>

            {/* Header */}
            <header className="animate-fade-in-up mb-8 md:mb-12">
                <h1 className="font-display text-primary-400 text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                    COMPONENTES
                </h1>
                <p className="font-body text-word-200 mt-2 text-lg md:text-xl">
                    Componentes React Reutilizables — Voltage Industrial Design
                    System
                </p>
            </header>

            {/* === FORM ELEMENTS === */}
            <section className="mb-8 md:mb-12">
                <h2 className="font-display text-word-100 mb-6 text-2xl font-bold tracking-widest uppercase">
                    Elementos de Formulario
                </h2>

                {/* Button */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Boton
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Variantes
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primario</Button>
                                <Button variant="secondary">Secundario</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="danger">Peligro</Button>
                                <Button variant="danger-outline">
                                    Peligro Outline
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Tamanos
                            </h4>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button variant="primary" size="sm">
                                    Pequeno
                                </Button>
                                <Button variant="primary" size="md">
                                    Mediano
                                </Button>
                                <Button variant="primary" size="lg">
                                    Grande
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Estados
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">
                                    Predeterminado
                                </Button>
                                <Button variant="primary" disabled>
                                    Desactivado
                                </Button>
                                <Button variant="primary" glow>
                                    Con Glow
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Input */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Campo de Texto
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Predeterminado
                            </h4>
                            <Input
                                type="text"
                                label="Nombre del Entrenamiento"
                                placeholder="Ingresa el nombre..."
                            />
                        </div>
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Con Error
                            </h4>
                            <Input
                                type="email"
                                label="Correo Electronico"
                                placeholder="tu@correo.com"
                                error="Por favor, ingresa un correo valido"
                                defaultValue="correo-invalido"
                                isRequired
                            />
                        </div>
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Variante Ghost
                            </h4>
                            <Input
                                type="text"
                                placeholder="Buscar ejercicios..."
                                variant="ghost"
                            />
                        </div>
                    </Card>
                </section>

                {/* Label */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Etiqueta
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Normal
                            </h4>
                            <Label>Correo Electronico</Label>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Requerido
                            </h4>
                            <Label required>Nombre Completo</Label>
                        </div>
                    </Card>
                </section>

                {/* Textarea */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Area de Texto
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Predeterminado
                            </h4>
                            <Textarea
                                label="Notas"
                                placeholder="Escribe tus notas aqui..."
                            />
                        </div>
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Con Error
                            </h4>
                            <Textarea
                                label="Descripcion"
                                placeholder="Descripcion..."
                                error="La descripcion es obligatoria"
                            />
                        </div>
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Redimensionable
                            </h4>
                            <Textarea
                                label="Comentarios"
                                placeholder="Redimensionable..."
                                resize
                            />
                        </div>
                    </Card>
                </section>

                {/* Select */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Selector
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Predeterminado
                            </h4>
                            <Select
                                label="Categoria"
                                placeholder="Selecciona una categoria"
                                options={[
                                    { value: 'fuerza', label: 'Fuerza' },
                                    {
                                        value: 'hipertrofia',
                                        label: 'Hipertrofia',
                                    },
                                    {
                                        value: 'resistencia',
                                        label: 'Resistencia',
                                    },
                                ]}
                                value={selectValue}
                                onChange={setSelectValue}
                            />
                            <p className="text-word-400 text-sm">
                                Valor seleccionado:{' '}
                                <span className="text-primary-400 font-mono">
                                    {selectValue || 'ninguno'}
                                </span>
                            </p>
                        </div>
                        <div className="max-w-md space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Con Error
                            </h4>
                            <Select
                                label="Nivel"
                                placeholder="Selecciona un nivel"
                                options={[
                                    {
                                        value: 'principiante',
                                        label: 'Principiante',
                                    },
                                    {
                                        value: 'intermedio',
                                        label: 'Intermedio',
                                    },
                                ]}
                                error="Debes seleccionar un nivel"
                            />
                        </div>
                    </Card>
                </section>

                {/* Checkbox */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Casilla de Verificacion
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Estados
                            </h4>
                            <div className="flex flex-col gap-4">
                                <Checkbox
                                    label="Activar notificaciones"
                                    checked={checkbox1}
                                    onChange={(e) =>
                                        setCheckbox1(e.target.checked)
                                    }
                                />
                                <Checkbox
                                    label="Terminos y condiciones"
                                    checked={checkbox2}
                                    onChange={(e) =>
                                        setCheckbox2(e.target.checked)
                                    }
                                />
                                <Checkbox label="Opcion desactivada" disabled />
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Switch */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Interruptor
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Tamanos
                            </h4>
                            <div className="flex items-center gap-8">
                                <Switch
                                    checked={switch1}
                                    onChange={(e) =>
                                        setSwitch1(e.target.checked)
                                    }
                                />
                                <Switch size="sm" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Estados
                            </h4>
                            <div className="flex items-center gap-8">
                                <Switch
                                    checked={switch2}
                                    onChange={(e) =>
                                        setSwitch2(e.target.checked)
                                    }
                                />
                                <Switch disabled />
                            </div>
                        </div>
                    </Card>
                </section>
            </section>

            {/* === FEEDBACK === */}
            <section className="mb-8 md:mb-12">
                <h2 className="font-display text-word-100 mb-6 text-2xl font-bold tracking-widest uppercase">
                    Retroalimentacion
                </h2>

                {/* Spinner */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Indicador de Carga
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Tamanos
                            </h4>
                            <div className="flex items-center gap-8">
                                <Spinner size="sm" />
                                <Spinner size="md" />
                                <Spinner size="lg" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Variantes
                            </h4>
                            <div className="flex items-center gap-8">
                                <Spinner variant="primary" />
                                <Spinner variant="secondary" />
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Badge */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Insignia
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Variantes
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                <Badge>Default</Badge>
                                <Badge variant="primary">Primario</Badge>
                                <Badge variant="success">Exito</Badge>
                                <Badge variant="warning">Advertencia</Badge>
                                <Badge variant="danger">Peligro</Badge>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Toast */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Notificacion Toast
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Disparar Toasts
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        addToast(
                                            'Operacion completada exitosamente',
                                            'success',
                                            'top-right',
                                            5000
                                        )
                                    }
                                >
                                    Exito (top-right)
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        addToast(
                                            'Ocurrio un error al procesar',
                                            'error',
                                            'bottom-right',
                                            5000
                                        )
                                    }
                                >
                                    Error (bottom-right)
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        addToast(
                                            'Advertencia: verifica tus datos',
                                            'warning',
                                            'top-left',
                                            5000
                                        )
                                    }
                                >
                                    Advertencia (top-left)
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        addToast(
                                            'Nueva actualizacion disponible',
                                            'info',
                                            'bottom-left',
                                            5000
                                        )
                                    }
                                >
                                    Info (bottom-left)
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </section>

            {/* === NAVIGATION === */}
            <section className="mb-8 md:mb-12">
                <h2 className="font-display text-word-100 mb-6 text-2xl font-bold tracking-widest uppercase">
                    Navegacion
                </h2>

                {/* Tabs */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Pestañas
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Predeterminado
                            </h4>
                            <Tabs
                                tabs={[
                                    { id: 'rutinas', label: 'Rutinas' },
                                    { id: 'ejercicios', label: 'Ejercicios' },
                                    { id: 'historial', label: 'Historial' },
                                ]}
                                activeTab={activeTab}
                                onChange={setActiveTab}
                            >
                                {tabContent[activeTab]}
                            </Tabs>
                        </div>
                    </Card>
                </section>
            </section>

            {/* === DATA DISPLAY === */}
            <section className="mb-8 md:mb-12">
                <h2 className="font-display text-word-100 mb-6 text-2xl font-bold tracking-widest uppercase">
                    Visualizacion de Datos
                </h2>

                {/* Card */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Tarjeta
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Glass Card
                            </h4>
                            <Card className="p-6">
                                <p className="text-word-200">
                                    Contenido dentro de una tarjeta
                                    glass-morphism con backdrop-blur
                                </p>
                            </Card>
                        </div>
                    </Card>
                </section>

                {/* Avatar */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Avatar
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Tamanos
                            </h4>
                            <div className="flex items-center gap-4">
                                <Avatar size="sm" fallback="Juan Perez" />
                                <Avatar size="md" fallback="Juan Perez" />
                                <Avatar size="lg" fallback="Juan Perez" />
                                <Avatar size="xl" fallback="Juan Perez" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Fallbacks
                            </h4>
                            <div className="flex items-center gap-4">
                                <Avatar fallback="Ana Garcia" />
                                <Avatar fallback="" />
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Glow Effect */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Efecto Glow
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="flex flex-wrap gap-8">
                            <div className="space-y-2 text-center">
                                <GlowEffect
                                    color="primary"
                                    intensity="sm"
                                    className="bg-primary-400 p-4 font-mono font-bold text-black md:p-6"
                                >
                                    SM
                                </GlowEffect>
                                <span className="text-word-400 font-mono text-xs">
                                    Pequeno
                                </span>
                            </div>
                            <div className="space-y-2 text-center">
                                <GlowEffect
                                    color="primary"
                                    intensity="md"
                                    className="bg-primary-400 p-4 font-mono font-bold text-black md:p-6"
                                >
                                    MD
                                </GlowEffect>
                                <span className="text-word-400 font-mono text-xs">
                                    Mediano
                                </span>
                            </div>
                            <div className="space-y-2 text-center">
                                <GlowEffect
                                    color="primary"
                                    intensity="lg"
                                    className="bg-primary-400 p-4 font-mono font-bold text-black md:p-6"
                                >
                                    LG
                                </GlowEffect>
                                <span className="text-word-400 font-mono text-xs">
                                    Grande
                                </span>
                            </div>
                        </div>
                    </Card>
                </section>
            </section>

            {/* === OVERLAYS === */}
            <section className="mb-8 md:mb-12">
                <h2 className="font-display text-word-100 mb-6 text-2xl font-bold tracking-widest uppercase">
                    Superposiciones
                </h2>

                {/* Modal */}
                <section className="animate-fade-in-up mb-12 md:mb-16">
                    <h3 className="font-display text-word-100 mb-3 text-xl font-bold tracking-widest uppercase md:mb-4">
                        Modal
                    </h3>
                    <Card className="space-y-8 p-4 md:p-6 lg:p-8">
                        <div className="space-y-4">
                            <h4 className="text-word-400 font-mono text-xs tracking-widest uppercase md:text-sm">
                                Abrir Modal
                            </h4>
                            <p className="text-word-400 text-sm">
                                Cada boton abre un modal del tamaño
                                correspondiente. Se cierra con Escape, click en
                                backdrop o boton X.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                variant="primary"
                                onClick={() => handleOpenModal('sm')}
                            >
                                Abrir Modal Pequeno
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => handleOpenModal('md')}
                            >
                                Abrir Modal Mediano
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => handleOpenModal('lg')}
                            >
                                Abrir Modal Grande
                            </Button>
                        </div>
                    </Card>
                </section>
            </section>

            {/* Footer */}
            <footer className="border-secondary-800 border-t px-4 pt-6 text-center md:px-0 md:pt-8">
                <p className="text-word-400 font-mono text-xs md:text-sm">
                    IRON TRACK — Voltage Industrial Design System v1.0
                </p>
            </footer>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Modal ${modalSize === 'sm' ? 'Pequeno' : modalSize === 'md' ? 'Mediano' : 'Grande'}`}
                size={modalSize}
            >
                <p className="text-word-200">
                    Este es un modal interactivo de tamaño{' '}
                    <span className="text-primary-400 font-bold uppercase">
                        {modalSize}
                    </span>
                    . Puedes cerrarlo presionando Escape, haciendo click en el
                    fondo oscuro, o usando el boton X.
                </p>
            </Modal>
        </main>
    )
}

export default DesignSystemPage
