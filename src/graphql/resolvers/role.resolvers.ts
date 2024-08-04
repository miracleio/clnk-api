import Role from "../../models/role.model.js";

const roleResolvers = {
  Query: {
    roles: async () => {
      return await Role.find();
    },
  },
  Mutation: {
    createRole: async (
      parent: any,
      args: { name: string },
      context: any,
      info: any
    ) => {
      const name = args?.name;
      const role = new Role({ name });
      await role.save();
      return role;
    },
    deleteRole: async (
      parent: any,
      args: { id: string },
      context: any,
      info: any
    ) => {
      const id = args?.id;
      return await Role.findByIdAndDelete(id);
    },
  },
};

export default roleResolvers;
