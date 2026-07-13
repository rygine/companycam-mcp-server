// GENERATED FILE — do not edit by hand.
// Run `yarn generate` (src/tools/convert.ts) to regenerate from openapi.json.

import { z } from "zod";

import { type Tool } from "./types.js";

const tools: Tool[] = [
  {
    name: "archive_project",
    title: "Archive Project",
    description: "Archive Project. PATCH /projects/{id}/archive",
    method: "PATCH",
    path: "/projects/{id}/archive",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Archive Project",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "assign_user_to_project",
    title: "Assign a user to a project",
    description:
      "Assign a user to a project. PUT /projects/{project_id}/assigned_users/{user_id}",
    method: "PUT",
    path: "/projects/{project_id}/assigned_users/{user_id}",
    paramIn: {
      "X-CompanyCam-User": "header",
      project_id: "path",
      user_id: "path",
    },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the assigner")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      user_id: z
        .string()
        .describe("ID of the User (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Assign a user to a project",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "create_group",
    title: "Create Group",
    description: "Create Group. POST /groups",
    method: "POST",
    path: "/groups",
    paramIn: { "X-CompanyCam-User": "header" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the creator")
        .optional(),
      body: z
        .looseObject({
          group: z
            .looseObject({
              name: z.string().optional(),
              users: z.array(z.string()).optional(),
            })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Create Group",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_invitation",
    title: "Create a new project invitation for collaboration",
    description:
      "Create a new project invitation for collaboration. POST /projects/{project_id}/invitations",
    method: "POST",
    path: "/projects/{project_id}/invitations",
    paramIn: { "X-CompanyCam-User": "header", project_id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the inviter")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Create a new project invitation for collaboration",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_photo_comment",
    title: "Add Comment",
    description: "Add Comment. POST /photos/{photo_id}/comments",
    method: "POST",
    path: "/photos/{photo_id}/comments",
    paramIn: { "X-CompanyCam-User": "header", photo_id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the commenter")
        .optional(),
      photo_id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
      body: z
        .looseObject({
          comment: z.looseObject({ content: z.string().optional() }).optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Add Comment",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_photo_tags",
    title: "Add Tags",
    description: "Add Tags. POST /photos/{photo_id}/tags",
    method: "POST",
    path: "/photos/{photo_id}/tags",
    paramIn: { photo_id: "path" },
    inputSchema: {
      photo_id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
      body: z
        .looseObject({ tags: z.array(z.string()).optional() })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Add Tags",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_project",
    title: "Create Project",
    description: "Create Project. POST /projects",
    method: "POST",
    path: "/projects",
    paramIn: { "X-CompanyCam-User": "header" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the creator")
        .optional(),
      body: z
        .looseObject({
          name: z
            .string()
            .describe("The name of the project")
            .default("Joe Smith")
            .optional(),
          address: z
            .looseObject({
              street_address_1: z.string().nullable().optional(),
              street_address_2: z.string().nullable().optional(),
              city: z.string().nullable().optional(),
              state: z.string().nullable().optional(),
              postal_code: z.string().nullable().optional(),
              country: z.string().nullable().optional(),
            })
            .optional(),
          coordinates: z
            .looseObject({
              lat: z.number().describe("format: float"),
              lon: z.number().describe("format: float"),
            })
            .optional(),
          geofence: z
            .array(
              z.looseObject({
                lat: z.number().describe("format: float"),
                lon: z.number().describe("format: float"),
              }),
            )
            .optional(),
          primary_contact: z
            .looseObject({
              name: z.string().describe("The name of the contact"),
              email: z.string().describe("The email of the contact").optional(),
              phone_number: z
                .string()
                .describe("The phone of the contact")
                .optional(),
            })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Create Project",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_project_checklist",
    title: "Create Checklist on Project from a Checklist Template",
    description:
      "Create Checklist on Project from a Checklist Template. POST /projects/{project_id}/checklists",
    method: "POST",
    path: "/projects/{project_id}/checklists",
    paramIn: { "X-CompanyCam-User": "header", project_id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the creator")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({
          checklist_template_id: z.string().describe("format: id").optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Create Checklist on Project from a Checklist Template",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_project_comment",
    title: "Add Project Comment",
    description: "Add Project Comment. POST /projects/{project_id}/comments",
    method: "POST",
    path: "/projects/{project_id}/comments",
    paramIn: { "X-CompanyCam-User": "header", project_id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the commenter")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({
          comment: z.looseObject({ content: z.string().optional() }).optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Add Project Comment",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_project_document",
    title: "Upload a Document",
    description: "Upload a Document. POST /projects/{project_id}/documents",
    method: "POST",
    path: "/projects/{project_id}/documents",
    paramIn: { "X-CompanyCam-User": "header", project_id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the creator")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({
          document: z
            .looseObject({
              name: z.string().optional(),
              attachment: z
                .string()
                .describe("Base64 encoded file contents with 30 MB limit")
                .optional(),
            })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Upload a Document",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_project_labels",
    title: "Add Labels",
    description: "Add Labels. POST /projects/{project_id}/labels",
    method: "POST",
    path: "/projects/{project_id}/labels",
    paramIn: { project_id: "path" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({
          project: z
            .looseObject({ labels: z.array(z.string()).optional() })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Add Labels",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_project_photo",
    title: "Add Photo",
    description: "Add Photo. POST /projects/{project_id}/photos",
    method: "POST",
    path: "/projects/{project_id}/photos",
    paramIn: { "X-CompanyCam-User": "header", project_id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the creator")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({
          photo: z.looseObject({
            coordinates: z
              .looseObject({
                lat: z.number().describe("format: float"),
                lon: z.number().describe("format: float"),
              })
              .optional(),
            uri: z.string(),
            captured_at: z
              .number()
              .int()
              .describe(
                "Unix timestamp when the Photo was captured — format: int32",
              ),
            description: z
              .string()
              .describe("A description of the photo")
              .optional(),
            tags: z.array(z.string()).optional(),
          }),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Add Photo",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_tag",
    title: "Create Tag",
    description: "Create Tag. POST /tags",
    method: "POST",
    path: "/tags",
    paramIn: {},
    inputSchema: {
      body: z
        .looseObject({
          tag: z
            .looseObject({ display_value: z.string().optional() })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Create Tag",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_user",
    title: "Create User",
    description: "Create User. POST /users",
    method: "POST",
    path: "/users",
    paramIn: { "X-CompanyCam-User": "header" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the creator")
        .optional(),
      body: z
        .looseObject({
          user: z
            .looseObject({
              first_name: z.string().optional(),
              last_name: z.string().optional(),
              email_address: z.string().optional(),
              phone_number: z.string().optional(),
              password: z.string().optional(),
              user_role: z
                .string()
                .describe(
                  "Role for the user. Allowed values: standard (default), restricted",
                )
                .optional(),
            })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Create User",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "create_webhook",
    title: "Create Webhook",
    description: "Create Webhook. POST /webhooks",
    method: "POST",
    path: "/webhooks",
    paramIn: {},
    inputSchema: {
      body: z
        .looseObject({
          url: z.string().optional(),
          scopes: z.array(z.string()).optional(),
          enabled: z.boolean().optional(),
          token: z.string().optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Create Webhook",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "delete_group",
    title: "Delete a Group",
    description: "Delete a Group. DELETE /groups/{id}",
    method: "DELETE",
    path: "/groups/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Group (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete a Group",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "delete_photo",
    title: "Delete Photo",
    description: "Delete Photo. DELETE /photos/{id}",
    method: "DELETE",
    path: "/photos/{id}",
    paramIn: { "X-CompanyCam-User": "header", id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the editor")
        .optional(),
      id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete Photo",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "delete_project",
    title: "Delete Project",
    description: "Delete Project. DELETE /projects/{id}",
    method: "DELETE",
    path: "/projects/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete Project",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "delete_project_label",
    title: "Delete Label",
    description: "Delete Label. DELETE /projects/{project_id}/labels/{id}",
    method: "DELETE",
    path: "/projects/{project_id}/labels/{id}",
    paramIn: { id: "path", project_id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Label (path parameter, required) — format: id"),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete Label",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "delete_tag",
    title: "Delete a Tag",
    description: "Delete a Tag. DELETE /tags/{id}",
    method: "DELETE",
    path: "/tags/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Tag (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete a Tag",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "delete_user",
    title: "Delete User",
    description: "Delete User. DELETE /users/{id}",
    method: "DELETE",
    path: "/users/{id}",
    paramIn: { "X-CompanyCam-User": "header", id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the editor")
        .optional(),
      id: z
        .string()
        .describe("ID of the User (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete User",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "delete_webhook",
    title: "Delete Webhook",
    description: "Delete Webhook. DELETE /webhooks/{id}",
    method: "DELETE",
    path: "/webhooks/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Webhook (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Delete Webhook",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_current_company",
    title: "Retrieve Company",
    description: "Retrieve Company. GET /company",
    method: "GET",
    path: "/company",
    paramIn: {},
    inputSchema: {},
    annotations: {
      title: "Retrieve Company",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_current_user",
    title: "Retrieve Current User",
    description: "Retrieve Current User. GET /users/current",
    method: "GET",
    path: "/users/current",
    paramIn: {},
    inputSchema: {},
    annotations: {
      title: "Retrieve Current User",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_group",
    title: "Retrieve Group",
    description: "Retrieve Group. GET /groups/{id}",
    method: "GET",
    path: "/groups/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Group (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve Group",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_photo",
    title: "Retrieve Photo",
    description: "Retrieve Photo. GET /photos/{id}",
    method: "GET",
    path: "/photos/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve Photo",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_project",
    title: "Retrieve Project",
    description: "Retrieve Project. GET /projects/{id}",
    method: "GET",
    path: "/projects/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve Project",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_project_checklist",
    title: "Retrieve Project Checklist",
    description:
      "Retrieve Project Checklist. GET /projects/{project_id}/checklists/{id}",
    method: "GET",
    path: "/projects/{project_id}/checklists/{id}",
    paramIn: { project_id: "path", id: "path" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      id: z
        .string()
        .describe(
          "ID of the Checklist (path parameter, required) — format: id",
        ),
    },
    annotations: {
      title: "Retrieve Project Checklist",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_tag",
    title: "Retrieve tag",
    description: "Retrieve tag. GET /tags/{id}",
    method: "GET",
    path: "/tags/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Tag (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve tag",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_user",
    title: "Retrieve User",
    description: "Retrieve User. GET /users/{id}",
    method: "GET",
    path: "/users/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the User (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve User",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_video",
    title: "Retrieve Video",
    description:
      "Retrieve Video — Returns details for a single video.\n\n**Important:** Until `status` is `processed`, `playback_url`\nreturns the raw upload URL (the `pending_uri`) and `format`\nreturns the file extension of that URL — not the HLS\nplayback URL or `m3u8`. Poll this endpoint until\n`status: processed` before consuming\n`playback_url`/`format`.\n. GET /videos/{id}",
    method: "GET",
    path: "/videos/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Video (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve Video",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_webhook",
    title: "Retrieve Webhook",
    description: "Retrieve Webhook. GET /webhooks/{id}",
    method: "GET",
    path: "/webhooks/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Webhooks (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Retrieve Webhook",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_checklist_templates",
    title: "List All Checklist Templates",
    description: "List All Checklist Templates. GET /templates/checklists",
    method: "GET",
    path: "/templates/checklists",
    paramIn: {},
    inputSchema: {},
    annotations: {
      title: "List All Checklist Templates",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_checklists",
    title: "List All Checklists",
    description: "List All Checklists. GET /checklists",
    method: "GET",
    path: "/checklists",
    paramIn: { page: "query", per_page: "query", completed: "query" },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
      completed: z.boolean().optional(),
    },
    annotations: {
      title: "List All Checklists",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_groups",
    title: "List Groups",
    description: "List Groups. GET /groups",
    method: "GET",
    path: "/groups",
    paramIn: { page: "query", per_page: "query" },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Groups",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_photo_comments",
    title: "List Photo Comments",
    description: "List Photo Comments. GET /photos/{photo_id}/comments",
    method: "GET",
    path: "/photos/{photo_id}/comments",
    paramIn: { photo_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      photo_id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Photo Comments",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_photo_tags",
    title: "List Photo Tags",
    description: "List Photo Tags. GET /photos/{photo_id}/tags",
    method: "GET",
    path: "/photos/{photo_id}/tags",
    paramIn: { photo_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      photo_id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Photo Tags",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_photos",
    title: "List Photos",
    description: "List Photos. GET /photos",
    method: "GET",
    path: "/photos",
    paramIn: {
      page: "query",
      per_page: "query",
      after: "query",
      before: "query",
      start_date: "query",
      end_date: "query",
      project_ids: "query",
      user_ids: "query",
      group_ids: "query",
      tag_ids: "query",
    },
    inputSchema: {
      page: z
        .number()
        .int()
        .describe(
          "Page number for offset-based pagination. Cannot be used with cursor pagination (after/before params) — format: int32",
        )
        .optional(),
      per_page: z
        .number()
        .int()
        .max(100)
        .describe(
          "Number of results per page. Default 50, maximum 100 — format: int32",
        )
        .default(50)
        .optional(),
      after: z
        .string()
        .describe(
          "Cursor for forward pagination. Comes from X-Next-Cursor header value. Returns results after this cursor position. Cannot be used with 'before' or 'page'",
        )
        .optional(),
      before: z
        .string()
        .describe(
          "Cursor for backward pagination. Comes from X-Prev-Cursor header value. Returns results before this cursor position. Cannot be used with 'after' or 'page'",
        )
        .optional(),
      start_date: z
        .string()
        .describe(
          "A unix timestamp to return photos captured on or after the provided value",
        )
        .optional(),
      end_date: z
        .string()
        .describe(
          "A unix timestamp to return photos captured on or before the provided value",
        )
        .optional(),
      project_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include photos from one of these project IDs",
        )
        .optional(),
      user_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include photos captured by one of these user IDs",
        )
        .optional(),
      group_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include photos captured by users in one of these group IDs",
        )
        .optional(),
      tag_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe("Filter results to include photos with one of these tag IDs")
        .optional(),
    },
    annotations: {
      title: "List Photos",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_assigned_users",
    title: "List assigned users",
    description:
      "List assigned users. GET /projects/{project_id}/assigned_users",
    method: "GET",
    path: "/projects/{project_id}/assigned_users",
    paramIn: { project_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List assigned users",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_checklists",
    title: "List Project Checklists",
    description:
      "List Project Checklists. GET /projects/{project_id}/checklists",
    method: "GET",
    path: "/projects/{project_id}/checklists",
    paramIn: { project_id: "path" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "List Project Checklists",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_collaborators",
    title: "List project collaborators",
    description:
      "List project collaborators. GET /projects/{project_id}/collaborators",
    method: "GET",
    path: "/projects/{project_id}/collaborators",
    paramIn: { project_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List project collaborators",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_comments",
    title: "List Project Comments",
    description: "List Project Comments. GET /projects/{project_id}/comments",
    method: "GET",
    path: "/projects/{project_id}/comments",
    paramIn: { project_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Project Comments",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_documents",
    title: "List Project Documents",
    description: "List Project Documents. GET /projects/{project_id}/documents",
    method: "GET",
    path: "/projects/{project_id}/documents",
    paramIn: { project_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Project Documents",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_invitations",
    title: "List project invitations",
    description:
      "List project invitations. GET /projects/{project_id}/invitations",
    method: "GET",
    path: "/projects/{project_id}/invitations",
    paramIn: { project_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List project invitations",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_labels",
    title: "List Project Labels",
    description: "List Project Labels. GET /projects/{project_id}/labels",
    method: "GET",
    path: "/projects/{project_id}/labels",
    paramIn: { project_id: "path", page: "query", per_page: "query" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Project Labels",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_photos",
    title: "List Photos",
    description: "List Photos. GET /projects/{project_id}/photos",
    method: "GET",
    path: "/projects/{project_id}/photos",
    paramIn: {
      project_id: "path",
      page: "query",
      per_page: "query",
      after: "query",
      before: "query",
      start_date: "query",
      end_date: "query",
      user_ids: "query",
      group_ids: "query",
      tag_ids: "query",
    },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z
        .number()
        .int()
        .describe(
          "Page number for offset-based pagination. Cannot be used with cursor pagination (after/before params) — format: int32",
        )
        .optional(),
      per_page: z
        .number()
        .int()
        .max(100)
        .describe(
          "Number of results per page. Default 50, maximum 100 — format: int32",
        )
        .default(50)
        .optional(),
      after: z
        .string()
        .describe(
          "Cursor for forward pagination. Comes from X-Next-Cursor header value. Returns results after this cursor position. Cannot be used with 'before' or 'page'",
        )
        .optional(),
      before: z
        .string()
        .describe(
          "Cursor for backward pagination. Comes from X-Prev-Cursor header value. Returns results before this cursor position. Cannot be used with 'after' or 'page'",
        )
        .optional(),
      start_date: z
        .string()
        .describe(
          "A unix timestamp to return photos captured on or after the provided value",
        )
        .optional(),
      end_date: z
        .string()
        .describe(
          "A unix timestamp to return photos captured on or before the provided value",
        )
        .optional(),
      user_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include photos captured by one of these user IDs",
        )
        .optional(),
      group_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include photos captured by users in one of these group IDs",
        )
        .optional(),
      tag_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe("Filter results to include photos with one of these tag IDs")
        .optional(),
    },
    annotations: {
      title: "List Photos",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_project_videos",
    title: "List Videos",
    description:
      "List Videos — Returns videos captured at the specified project.\n\n**Important:** Until a video's `status` is `processed`, the\n`playback_url` field returns the raw upload URL (the\n`pending_uri`) and `format` returns the file extension of\nthat URL — not the HLS playback URL or `m3u8`. Subscribe\nto the `video.updated` webhook or poll\n`GET /videos/{id}` until `status: processed` before\nconsuming `playback_url`/`format`.\n. GET /projects/{project_id}/videos",
    method: "GET",
    path: "/projects/{project_id}/videos",
    paramIn: {
      project_id: "path",
      page: "query",
      per_page: "query",
      start_date: "query",
      end_date: "query",
      user_ids: "query",
      group_ids: "query",
      tag_ids: "query",
    },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
      start_date: z
        .string()
        .describe(
          "A unix timestamp to return videos captured on or after the provided value",
        )
        .optional(),
      end_date: z
        .string()
        .describe(
          "A unix timestamp to return videos captured on or before the provided value",
        )
        .optional(),
      user_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos captured by one of these user IDs",
        )
        .optional(),
      group_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos captured by one of these group IDs",
        )
        .optional(),
      tag_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos tagged with one of these tag IDs",
        )
        .optional(),
    },
    annotations: {
      title: "List Videos",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_projects",
    title: "List Projects",
    description: "List Projects. GET /projects",
    method: "GET",
    path: "/projects",
    paramIn: {
      page: "query",
      per_page: "query",
      query: "query",
      modified_since: "query",
    },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
      query: z
        .string()
        .describe(
          "An optional value to filter the projects by name or address line 1",
        )
        .optional(),
      modified_since: z
        .string()
        .describe(
          "An ISO8601 formatted date and time to return projects modified on or after the provided value",
        )
        .optional(),
    },
    annotations: {
      title: "List Projects",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_tags",
    title: "List All Tags",
    description: "List All Tags. GET /tags",
    method: "GET",
    path: "/tags",
    paramIn: { page: "query", per_page: "query" },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List All Tags",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_users",
    title: "List All Users",
    description: "List All Users. GET /users",
    method: "GET",
    path: "/users",
    paramIn: { page: "query", per_page: "query" },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List All Users",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_videos",
    title: "List Videos",
    description:
      "List Videos — Returns videos visible to the authenticated user, sorted by\ncapture date (most recent first). Supports the same\nfiltering and pagination parameters as `/photos`.\n\n**Important:** Until a video's `status` is `processed`, the\n`playback_url` field returns the raw upload URL (the\n`pending_uri`) and `format` returns the file extension of\nthat URL — not the HLS playback URL or `m3u8`. Subscribe\nto the `video.updated` webhook or poll\n`GET /videos/{id}` until `status: processed` before\nconsuming `playback_url`/`format`.\n. GET /videos",
    method: "GET",
    path: "/videos",
    paramIn: {
      page: "query",
      per_page: "query",
      start_date: "query",
      end_date: "query",
      project_ids: "query",
      user_ids: "query",
      group_ids: "query",
      tag_ids: "query",
    },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
      start_date: z
        .string()
        .describe(
          "A unix timestamp to return videos captured on or after the provided value",
        )
        .optional(),
      end_date: z
        .string()
        .describe(
          "A unix timestamp to return videos captured on or before the provided value",
        )
        .optional(),
      project_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos captured at one of these project IDs",
        )
        .optional(),
      user_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos captured by one of these user IDs",
        )
        .optional(),
      group_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos captured by one of these group IDs",
        )
        .optional(),
      tag_ids: z
        .array(z.number().int().describe("format: int64"))
        .describe(
          "Filter results to include videos tagged with one of these tag IDs",
        )
        .optional(),
    },
    annotations: {
      title: "List Videos",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "list_webhooks",
    title: "List Webhooks",
    description: "List Webhooks. GET /webhooks",
    method: "GET",
    path: "/webhooks",
    paramIn: { page: "query", per_page: "query" },
    inputSchema: {
      page: z.number().int().describe("format: int32").optional(),
      per_page: z.number().int().describe("format: int32").optional(),
    },
    annotations: {
      title: "List Webhooks",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "remove_user_from_project",
    title: "Remove assigned user from project",
    description:
      "Remove assigned user from project. DELETE /projects/{project_id}/assigned_users/{user_id}",
    method: "DELETE",
    path: "/projects/{project_id}/assigned_users/{user_id}",
    paramIn: {
      "X-CompanyCam-User": "header",
      project_id: "path",
      user_id: "path",
    },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the unassigner")
        .optional(),
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      user_id: z
        .string()
        .describe("ID of the User (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Remove assigned user from project",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "restore_project",
    title: "Restore Project",
    description: "Restore Project. PUT /projects/{id}/restore",
    method: "PUT",
    path: "/projects/{id}/restore",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
    },
    annotations: {
      title: "Restore Project",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_group",
    title: "Update Group",
    description: "Update Group. PUT /groups/{id}",
    method: "PUT",
    path: "/groups/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Group (path parameter, required) — format: id"),
      body: z
        .looseObject({
          group: z
            .looseObject({
              name: z.string().optional(),
              users: z.array(z.string()).optional(),
            })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update Group",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_photo",
    title: "Update Photo",
    description: "Update Photo. PUT /photos/{id}",
    method: "PUT",
    path: "/photos/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
      body: z
        .looseObject({
          photo: z.looseObject({ internal: z.boolean().optional() }).optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update Photo",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_photo_description",
    title: "Update Photo Description",
    description:
      "Update Photo Description. POST /photos/{photo_id}/descriptions",
    method: "POST",
    path: "/photos/{photo_id}/descriptions",
    paramIn: { photo_id: "path" },
    inputSchema: {
      photo_id: z
        .string()
        .describe("ID of the Photo (path parameter, required) — format: id"),
      body: z
        .looseObject({ description: z.string().optional() })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update Photo Description",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  {
    name: "update_project",
    title: "Update Project",
    description: "Update Project. PUT /projects/{id}",
    method: "PUT",
    path: "/projects/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({
          name: z.string().describe("The name of the project").optional(),
          address: z
            .looseObject({
              street_address_1: z.string().nullable().optional(),
              street_address_2: z.string().nullable().optional(),
              city: z.string().nullable().optional(),
              state: z.string().nullable().optional(),
              postal_code: z.string().nullable().optional(),
              country: z.string().nullable().optional(),
            })
            .optional(),
          coordinates: z
            .looseObject({
              lat: z.number().describe("format: float"),
              lon: z.number().describe("format: float"),
            })
            .optional(),
          geofence: z
            .array(
              z.looseObject({
                lat: z.number().describe("format: float"),
                lon: z.number().describe("format: float"),
              }),
            )
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update Project",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_project_notepad",
    title: "Update the project notepad",
    description:
      "Update the project notepad. PUT /projects/{project_id}/notepad",
    method: "PUT",
    path: "/projects/{project_id}/notepad",
    paramIn: { project_id: "path" },
    inputSchema: {
      project_id: z
        .string()
        .describe("ID of the Project (path parameter, required) — format: id"),
      body: z
        .looseObject({ notepad: z.string() })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update the project notepad",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_tag",
    title: "Update Tag",
    description: "Update Tag. PUT /tags/{id}",
    method: "PUT",
    path: "/tags/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Tag (path parameter, required) — format: id"),
      body: z
        .looseObject({
          tag: z
            .looseObject({ display_value: z.string().optional() })
            .optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update Tag",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_user",
    title: "Update User",
    description: "Update User. PUT /users/{id}",
    method: "PUT",
    path: "/users/{id}",
    paramIn: { "X-CompanyCam-User": "header", id: "path" },
    inputSchema: {
      "X-CompanyCam-User": z
        .string()
        .describe("Email of CompanyCam user to be designated as the editor")
        .optional(),
      id: z
        .string()
        .describe("ID of the User (path parameter, required) — format: id"),
      body: z
        .looseObject({
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          email_address: z.string().optional(),
          phone_number: z.string().optional(),
          password: z.string().optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update User",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "update_webhook",
    title: "Update Webhook",
    description: "Update Webhook. PUT /webhooks/{id}",
    method: "PUT",
    path: "/webhooks/{id}",
    paramIn: { id: "path" },
    inputSchema: {
      id: z
        .string()
        .describe("ID of the Webhook (path parameter, required) — format: id"),
      body: z
        .looseObject({
          url: z.string().optional(),
          scopes: z.array(z.string()).optional(),
          enabled: z.boolean().optional(),
          token: z.string().optional(),
        })
        .describe("JSON request body."),
    },
    annotations: {
      title: "Update Webhook",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
];

export default tools;
