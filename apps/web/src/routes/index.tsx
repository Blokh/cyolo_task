import {createFileRoute, Link} from '@tanstack/react-router'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  // This could be loaded from an API or state management
  const images = [
    { id: 1, src: logo, alt: 'Image 1' },
    { id: 2, src: logo, alt: 'Image 2' },
    { id: 3, src: logo, alt: 'Image 3' },
  ]

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>

        <Link
            to="/upload"
            className="inline-block mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload New Image
        </Link>

        {/* Image gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map(image => (
              <div key={image.id} className="border rounded p-4">
                <img src={image.src} alt={image.alt} className="w-full h-auto" />
              </div>
          ))}
        </div>
      </div>
  )
}