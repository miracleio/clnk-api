const urlTypeDefs = `#graphql

  type Url {
    id: ID!
    url: String!
    shortUrl: String!
    code: String
    user: User
    createdAt: String
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

  input CreateUrlUrlInput {
    url: String!
    code: String
  }

  type Query {
    getUrl(id: ID!): Url
    getUrls(pagination: Pagination, filter: UrlFilter): UrlData
    getAllUrls(pagination: Pagination, filter: UrlFilter): UrlData
  }

  type Mutation {
    createUrl(input: CreateUrlUrlInput!): Url
    updateUrl(id: ID!, url: String!): Url
    deleteUrl(id: ID!): Boolean
  }
`;

export default urlTypeDefs;
