import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {TextStyle} from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
    BoldIcon, 
    ItalicIcon, 
    ListBulletIcon, 
    LinkIcon,
    ArrowUturnLeftIcon,
    QueueListIcon,
    SwatchIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import './EmailEditor.css';

interface EmailEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

// Variables disponibles
const AVAILABLE_VARIABLES = [
    { label: 'Nombre Completo', value: '{{nombre_completo}}' },
    { label: 'Link Encuesta', value: '{{link_encuesta}}' },
    { label: 'Empresa', value: '{{empresa}}' },
];

// --- COMPONENTE BARRA DE HERRAMIENTAS ---
const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    if (!editor) return null;

    const PRESET_COLORS = [
        { name: 'Negro', value: '#000000' },
        { name: 'Gris', value: '#6B7280' },
        { name: 'Rojo', value: '#EF4444' },
        { name: 'Naranja', value: '#F97316' },
        { name: 'Amarillo', value: '#EAB308' },
        { name: 'Verde', value: '#10B981' },
        { name: 'Azul', value: '#3B82F6' },
        { name: 'Índigo', value: '#6366F1' },
        { name: 'Morado', value: '#A855F7' },
        { name: 'Rosa', value: '#EC4899' },
    ];

    const Button = ({ onClick, isActive, title, children }: {
        onClick: () => void;
        isActive?: boolean;
        title: string;
        children: React.ReactNode;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={clsx(
                "p-1.5 rounded-md transition-colors text-gray-500 hover:bg-gray-200 hover:text-gray-900",
                isActive && "bg-blue-100 text-blue-700 font-medium"
            )}
        >
            {children}
        </button>
    );

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const setColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
        setShowColorPicker(false);
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/50 p-2">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Negrita"
            >
                <BoldIcon className="w-4 h-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Cursiva"
            >
                <ItalicIcon className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            {/* Color Picker */}
            <div className="relative">
                <Button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    isActive={showColorPicker}
                    title="Color de texto"
                >
                    <SwatchIcon className="w-4 h-4" />
                </Button>
                
                {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-50">
                        <div className="text-xs font-medium text-gray-700 mb-2">Seleccionar color</div>
                        <div className="grid grid-cols-5 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setColor(color.value)}
                                    className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-110"
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().unsetColor().run()}
                            className="mt-2 w-full text-xs text-gray-600 hover:text-gray-900 py-1 hover:bg-gray-100 rounded"
                        >
                            Remover color
                        </button>
                    </div>
                )}
            </div>

            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Lista de puntos"
            >
                <ListBulletIcon className="w-4 h-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Lista numerada"
            >
                <QueueListIcon className="w-4 h-4" />
            </Button>

            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            <Button
                onClick={setLink}
                isActive={editor.isActive('link')}
                title="Insertar enlace"
            >
                <LinkIcon className="w-4 h-4" />
            </Button>
            
            <div className="flex-1"></div>
            
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                title="Deshacer"
            >
                <ArrowUturnLeftIcon className="w-4 h-4" />
            </Button>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export const EmailEditor = ({ value, onChange, placeholder }: EmailEditorProps) => {
    
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Escribe aquí...',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[250px] px-4 py-3 text-gray-700 max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external changes (e.g., when switching templates)
    useEffect(() => {
        if (editor && value !== undefined) {
            const currentContent = editor.getHTML();
            if (currentContent !== value) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    const insertVariable = (variable: string) => {
        editor?.chain().focus().insertContent(` ${variable} `).run();
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Barra de Variables */}
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 mb-1">
                <span className="font-medium mr-1 text-xs uppercase tracking-wide text-gray-400">Variables:</span>
                {AVAILABLE_VARIABLES.map((v) => (
                    <button
                        key={v.value}
                        type="button"
                        onClick={() => insertVariable(v.value)}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                        {v.label}
                    </button>
                ))}
            </div>

            {/* Editor Container */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all tiptap-editor-container">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};