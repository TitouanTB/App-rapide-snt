import { useState } from 'react'
import { FolderIcon, FileTextIcon, PlusIcon, UploadIcon, ChevronRightIcon, ChevronDownIcon, XIcon, ImageIcon } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { TreeNode, Course, Library, PDFFile, ImageFile } from '../types'
import { transcribeContentToFormat } from '../utils/courseLinker'

interface LibraryTabProps {
  library: Library
  onUpdateLibrary: (library: Library) => void
}

export function LibraryTab({ library, onUpdateLibrary }: LibraryTabProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['math-subject']))
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addDialogType, setAddDialogType] = useState<'folder' | 'course'>('folder')
  const [addDialogParent, setAddDialogParent] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newCourseContent, setNewCourseContent] = useState('')
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const openAddDialog = (type: 'folder' | 'course', parentId: string | null) => {
    setAddDialogType(type)
    setAddDialogParent(parentId)
    setNewItemName('')
    setNewCourseContent('')
    setShowAddDialog(true)
  }

  const addNewItem = () => {
    if (!newItemName.trim()) return

    const newId = `${addDialogType}-${Date.now()}`
    const newNode: TreeNode = {
      id: newId,
      name: newItemName,
      type: addDialogType,
      ...(addDialogType === 'folder' ? { children: [] } : {}),
      ...(addDialogType === 'course' ? {
        course: {
          id: newId,
          title: newItemName,
          content: newCourseContent,
          pdfs: [],
          images: [],
        }
      } : {}),
    }

    const addNodeToTree = (nodes: TreeNode[]): TreeNode[] => {
      if (!addDialogParent) {
        return [...nodes, newNode]
      }
      return nodes.map(node => {
        if (node.id === addDialogParent) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          }
        }
        if (node.children) {
          return {
            ...node,
            children: addNodeToTree(node.children),
          }
        }
        return node
      })
    }

    onUpdateLibrary({
      tree: addNodeToTree(library.tree),
    })

    setShowAddDialog(false)
    setNewItemName('')
    setNewCourseContent('')
  }

  const updateCourseInTree = (nodes: TreeNode[], courseId: string, updatedCourse: Course): TreeNode[] => {
    return nodes.map(node => {
      if (node.type === 'course' && node.course?.id === courseId) {
        return {
          ...node,
          course: updatedCourse,
        }
      }
      if (node.children) {
        return {
          ...node,
          children: updateCourseInTree(node.children, courseId, updatedCourse),
        }
      }
      return node
    })
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedCourse) return

    const newPdfs: PDFFile[] = []
    const newImages: ImageFile[] = []

    for (const file of acceptedFiles) {
      if (file.type === 'application/pdf') {
        try {
          const extractedText = `PDF téléchargé: ${file.name}\nTaille: ${(file.size / 1024).toFixed(2)} KB\n\nL'extraction automatique du texte sera disponible prochainement.`

          const newPdf: PDFFile = {
            id: `pdf-${Date.now()}-${Math.random()}`,
            name: file.name,
            extractedText,
            uploadedAt: new Date().toISOString(),
          }
          newPdfs.push(newPdf)
        } catch (error) {
          console.error(`Error processing PDF ${file.name}:`, error)
        }
      } else if (file.type.startsWith('image/')) {
        try {
          const reader = new FileReader()
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          const newImage: ImageFile = {
            id: `img-${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl,
            uploadedAt: new Date().toISOString(),
          }
          newImages.push(newImage)
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error)
        }
      }
    }

    if (newPdfs.length > 0 || newImages.length > 0) {
      const updatedCourse: Course = {
        ...selectedCourse,
        pdfs: [...selectedCourse.pdfs, ...newPdfs],
        images: [...selectedCourse.images, ...newImages],
      }

      const updatedTree = updateCourseInTree(library.tree, selectedCourse.id, updatedCourse)
      onUpdateLibrary({ tree: updatedTree })
      setSelectedCourse(updatedCourse)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  })

  const removePdf = (pdfId: string) => {
    if (!selectedCourse) return

    const updatedCourse: Course = {
      ...selectedCourse,
      pdfs: selectedCourse.pdfs.filter(pdf => pdf.id !== pdfId),
    }

    const updatedTree = updateCourseInTree(library.tree, selectedCourse.id, updatedCourse)
    onUpdateLibrary({ tree: updatedTree })
    setSelectedCourse(updatedCourse)
  }

  const removeImage = (imageId: string) => {
    if (!selectedCourse) return

    const updatedCourse: Course = {
      ...selectedCourse,
      images: selectedCourse.images.filter(img => img.id !== imageId),
    }

    const updatedTree = updateCourseInTree(library.tree, selectedCourse.id, updatedCourse)
    onUpdateLibrary({ tree: updatedTree })
    setSelectedCourse(updatedCourse)
  }

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCourse || !e.target.files) return

    const files = Array.from(e.target.files)
    const newImages: ImageFile[] = []

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const reader = new FileReader()
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          const newImage: ImageFile = {
            id: `img-${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl,
            uploadedAt: new Date().toISOString(),
          }
          newImages.push(newImage)
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error)
        }
      }
    }

    if (newImages.length > 0) {
      const updatedCourse: Course = {
        ...selectedCourse,
        images: [...selectedCourse.images, ...newImages],
      }

      const updatedTree = updateCourseInTree(library.tree, selectedCourse.id, updatedCourse)
      onUpdateLibrary({ tree: updatedTree })
      setSelectedCourse(updatedCourse)
    }

    setFileInputKey(Date.now())
  }

  const openImagePicker = () => {
    document.getElementById('image-upload-input')?.click()
  }

  const renderTree = (nodes: TreeNode[], level: number = 0): JSX.Element => {
    return (
      <div className="space-y-1">
        {nodes.map(node => (
          <div key={node.id}>
            <div
              className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                selectedCourse?.id === node.course?.id ? 'bg-primary-50' : ''
              }`}
              style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
              onClick={() => {
                if (node.type === 'folder') {
                  toggleNode(node.id)
                } else if (node.course) {
                  setSelectedCourse(node.course)
                }
              }}
            >
              {node.type === 'folder' && (
                <>
                  {expandedNodes.has(node.id) ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  )}
                  <FolderIcon className="w-5 h-5 text-primary-600" />
                </>
              )}
              {node.type === 'course' && (
                <>
                  <div className="w-4" />
                  <FileTextIcon className="w-5 h-5 text-blue-600" />
                </>
              )}
              <span className="flex-1 text-sm font-medium text-gray-800">{node.name}</span>
              {node.type === 'folder' && (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openAddDialog('folder', node.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Ajouter un sous-dossier"
                  >
                    <FolderIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => openAddDialog('course', node.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Ajouter un cours"
                  >
                    <PlusIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
            {node.type === 'folder' && node.children && expandedNodes.has(node.id) && (
              renderTree(node.children, level + 1)
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Bibliothèque</h2>
          <button
            onClick={() => openAddDialog('folder', null)}
            className="btn-primary text-sm py-1 px-3"
          >
            <PlusIcon className="w-4 h-4 inline mr-1" />
            Dossier
          </button>
        </div>
        {renderTree(library.tree)}
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md p-6 max-h-screen overflow-y-auto">
        {selectedCourse ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={openImagePicker}
                  className="btn-primary flex items-center gap-2"
                >
                  <ImageIcon className="w-5 h-5" />
                  📤 Ajouter image/schéma
                </button>
              </div>
              <input
                id="image-upload-input"
                key={fileInputKey}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileSelect}
                className="hidden"
              />
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Déposez les fichiers ici...'
                    : 'Glissez-déposez des PDFs ou images ici, ou cliquez pour sélectionner'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: PDF, PNG, JPG, JPEG, GIF, WEBP
                </p>
              </div>
            </div>

            {selectedCourse.pdfs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">PDFs attachés</h3>
                <div className="space-y-2">
                  {selectedCourse.pdfs.map(pdf => (
                    <div key={pdf.id} className="card flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{pdf.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(pdf.uploadedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <button
                        onClick={() => removePdf(pdf.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <XIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCourse.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  <ImageIcon className="w-5 h-5 inline mr-2" />
                  Images ({selectedCourse.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedCourse.images.map(image => (
                    <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                      <img
                        src={image.dataUrl}
                        alt={image.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-1 bg-white rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      <div className="p-2 bg-gray-50">
                        <p className="text-xs text-gray-600 truncate">{image.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(image.uploadedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Contenu du cours</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">📚 Format Retranscrit</h4>
                  <p className="text-xs text-blue-700">
                    Le contenu est automatiquement structuré en: Concepts clés, Applications et Points à réviser
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {selectedCourse.content
                      ? transcribeContentToFormat(selectedCourse.content)
                      : 'Aucun contenu pour ce cours.'}
                  </pre>
                </div>
              </div>
            </div>

            {selectedCourse.pdfs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Texte extrait des PDFs</h3>
                {selectedCourse.pdfs.map(pdf => (
                  <div key={pdf.id} className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">{pdf.name}</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs text-gray-600 font-mono">
                        {pdf.extractedText || 'Aucun texte extrait.'}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <FileTextIcon className="w-16 h-16 mx-auto mb-4" />
              <p>Sélectionnez un cours pour voir son contenu</p>
            </div>
          </div>
        )}
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">
              Ajouter un {addDialogType === 'folder' ? 'dossier' : 'cours'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={addDialogType === 'folder' ? 'Nom du dossier' : 'Titre du cours'}
                  autoFocus
                />
              </div>
              {addDialogType === 'course' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                  <textarea
                    className="input-field w-full"
                    rows={8}
                    value={newCourseContent}
                    onChange={(e) => setNewCourseContent(e.target.value)}
                    placeholder="Contenu du cours..."
                  />
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowAddDialog(false)} className="btn-secondary">
                  Annuler
                </button>
                <button onClick={addNewItem} className="btn-primary">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
