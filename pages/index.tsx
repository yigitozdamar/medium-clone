import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  // console.log(posts)

  return (
    <div className=" mx-auto max-w-7xl overflow-x-hidden">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className=" flex items-center justify-between border-b-2 border-black bg-yellow-500 p-10">
        <div className="space-y-7 px-10 ">
          <h1 className=" max-w-xl font-serif text-7xl">Stay Curious.</h1>
          <h2 className="  max-w-xl text-3xl">
            Discover stories, thinking, and expertise from writers on any topic.
          </h2>
        </div>

        <img
          className=" hidden md:inline-flex lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt=""
        />
      </div>
      {/* Posts */}
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border">
              {post.mainImage && (
                <img
                  className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                  src={urlFor(post.mainImage).url()!}
                  alt={post.description}
                />
              )}
              <div className="flex justify-between p-5">
                <div>
                  <p className=" text-lg font-bold">{post.title}</p>
                  <p className="text-sm">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt={post.author.name}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type== "post"]{
    _id,
    title,
    author ->{
    name,
    image
  },
  description,
  mainImage,
  slug 
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
