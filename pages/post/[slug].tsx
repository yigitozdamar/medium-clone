import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
interface Props {
  post: Post
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  console.log(post)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />

      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt={post.description}
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className=" mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className=" mb-2 text-xl font-light text-gray-500">
          {post.description}{' '}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt={post.author.name}
          />
          <p className="text-sm font-extralight">
            Blog Post by{' '}
            <span className="text-green-500">{post.author.name}</span> -
            Published At {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <PortableText
          projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
          dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
          content={post.body}
          serializers={{
            h1: (props: any) => (
              <h1 className="my-5 text-2xl font-bold" {...props} />
            ),
            h2: (props: any) => (
              <h1 className="my-5 text-xl font-bold" {...props} />
            ),
            li: ({ children }: any) => (
              <li className="ml-4 list-disc">{children}</li>
            ),
            link: ({ href, children }: any) => (
              <a href={href} className="text-blue-500 hover:underline">
                {children}
              </a>
            ),
          }}
        />
      </article>
      <hr className=" my-5 mx-auto max-w-lg border-yellow-500" />
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 py-10 text-white">
          <h3 className=" text-3xl font-bold">Thank you for your comment!</h3>
          <p>We will review it and get back to you...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" mx-auto my-10 mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className=" text-3xl font-bold">Enter your comment below...</h3>
          <hr className="mt-2 py-3" />
          <input
            {...register('_id')}
            name="_id"
            type="hidden"
            value={post._id}
          />
          <label className="mb-5 block">
            <span>Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border px-3 py-2 shadow outline-none ring-yellow-500 focus:ring"
              type="text"
              placeholder="Yigit Ozdamar"
            />
          </label>
          <label className="mb-5 block">
            <span>E-Mail</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border px-3 py-2 shadow outline-none ring-yellow-500 focus:ring"
              type="email"
              placeholder="yigitozdamar@email.com"
            />
          </label>
          <label className="mb-5 block">
            <span>Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className=" form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="Enter your comments here..."
              rows={8}
            />
          </label>
          <div className="flex flex-col">
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}

            {errors.comment && (
              <span className="text-red-500">{errors.comment.message}</span>
            )}
          </div>

          <input
            type="submit"
            className="focus:shadow-outline rounded bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      {/* Comments */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className=" text-xl">Comments</h3>
        <hr className=" pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className=" text-yellow-500">{comment.name}:</span>{' '}
              {comment.comment}{' '}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type== "post" && slug.current == "my-second-post"][0]{
    _id,
    _createdAt,
    title,
    author ->{
    name,
    image
     },
   "comments":*[
     _type == "comment" &&
     post._ref == ^._id &&
     approved == true],
  description,
  mainImage,
  slug,
  body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post, // will be passed to the page component as props
    },
    revalidate: 60, // renew the old cache every 60 seconds
  }
}
