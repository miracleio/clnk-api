import URL from "../../models/url.model.js";
import { shortenURL } from "../../services/url.services.js";

const URLResolvers = {
  Query: {
    getUrl: async (
      parent: any,
      args: { id: string; code: string },
      context: any,
      info: any
    ) => {
      try {
        const id = args.id;
        const code = args.code;
        if (code) {
          return await URL.findOne({
            code,
          }).populate("user");
        }
        return await URL.findById(id);
      } catch (error: any) {
        console.log("Query.getUrl error", error);
        throw new Error(error);
      }
    },
    getUrls: async (
      parent: any,
      args: {
        pagination: { page: number; limit: number };
        filters: {
          url: string;
          shortUrl: string;
          code: string;
          user: string;
        };
      },
      context: any,
      info: any
    ) => {
      try {
        const pagination = args.pagination || {};
        const filters = args.filters || {};
        const userId = context?.user?.data?.id;

        if (!userId) throw new Error("Unauthorized");

        let { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const constructedFilters: any = {};

        filters.url &&
          (constructedFilters.url = { $regex: filters.url, $options: "i" });
        filters.shortUrl &&
          (constructedFilters.shortUrl = {
            $regex: filters.shortUrl,
            $options: "i",
          });
        // match code exactly
        filters.code && (constructedFilters.code = filters.code);
        // filters.user && (constructedFilters.user = filters.user);

        const urls = await URL.find({ ...constructedFilters, user: userId })
          .sort({
            updatedAt: -1,
          })
          .limit(limit)
          .skip(skip)
          .populate("user");
        const totalCount = await URL.countDocuments({
          ...constructedFilters,
          user: userId,
        });
        const pages = Math.ceil(totalCount / limit);

        const meta = {
          page,
          limit,
          total: totalCount,
          pages: pages,
        };

        return {
          data: urls,
          meta,
        };
      } catch (error: any) {
        console.log("Query.getUrls error", error);
        throw new Error(error);
      }
    },
    getAllUrls: async (
      parent: any,
      args: {
        pagination: { page: number; limit: number };
        filters: {
          url: string;
          shortUrl: string;
          code: string;
          user: string;
        };
      },
      context: any,
      info: any
    ) => {
      try {
        const pagination = args.pagination || {};
        const filters = args.filters || {};

        let { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const constructedFilters: any = {};

        filters.url &&
          (constructedFilters.url = { $regex: filters.url, $options: "i" });
        filters.shortUrl &&
          (constructedFilters.shortUrl = {
            $regex: filters.shortUrl,
            $options: "i",
          });
        // match code exactly
        filters.code && (constructedFilters.code = filters.code);
        filters.user && (constructedFilters.user = filters.user);

        const urls = await URL.find(constructedFilters)
          .limit(limit)
          .skip(skip)
          .populate("user");
        const totalCount = await URL.countDocuments(constructedFilters);
        const pages = Math.ceil(totalCount / limit);

        const meta = {
          page,
          limit,
          total: totalCount,
          pages: pages,
        };

        return {
          data: urls,
          meta,
        };
      } catch (error: any) {
        console.log("Query.getUrls error", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createUrl: async (
      parent: any,
      args: { input: { url: any; code: any } },
      context: { user: { data: { id: any } } },
      info: any
    ) => {
      try {
        const url = args?.input?.url;
        const code = args?.input?.code;
        const userId = context?.user?.data?.id;

        return shortenURL({ url, userId, code });
      } catch (error: any) {
        console.log("Mutation.createUrl error", error);
        throw new Error(error);
      }
    },
    updateUrl: async (
      parent: any,
      args: { id: any; url: any },
      context: any,
      info: any
    ) => {
      try {
        const { id, url } = args;
        return await URL.findByIdAndUpdate(id, { url }, { new: true }).populate(
          "user"
        );
      } catch (error: any) {
        console.log("Mutation.updateUrl error", error);
        throw new Error(error);
      }
    },
    deleteUrl: async (
      parent: any,
      args: { id: any },
      context: any,
      info: any
    ) => {
      try {
        const { id } = args;
        await URL.findByIdAndDelete(id);
        return true;
      } catch (error: any) {
        console.log("Mutation.deleteUrl error", error);
        throw new Error(error);
      }
    },
  },
};

export default URLResolvers;
