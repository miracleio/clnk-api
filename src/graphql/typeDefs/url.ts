const urlTypeDefs = `#graphql

  type Url {
    id: ID!
    url: String!
    shortUrl: String!
    code: String
    image: String
    user: User
    createdAt: String
    updatedAt: String
  }

  type UrlData {
    data: [Url]
    meta: Meta
  }

  input UrlFilter {
    url: String
    shortUrl: String
    code: String
    user: ID
  }

  input CreateUrlInput {
    url: String!
    code: String
    shortUrl: String
    image: String
  }

  input UpdateUrlInput {
    id: ID!,
    url: String!
    shortUrl: String
    image: String
  }

  type Query {
    getUrl(id: ID, code: String): Url
    getUrls(pagination: Pagination, filter: UrlFilter): UrlData
    getAllUrls(pagination: Pagination, filter: UrlFilter): UrlData
  }

  type Mutation {
    createUrl(input: CreateUrlInput!): Url
    updateUrl(input: UpdateUrlInput!): Url
    deleteUrl(id: ID!): Boolean
  }
`;

export default urlTypeDefs;
