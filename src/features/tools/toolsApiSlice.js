import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const toolsAdapter = createEntityAdapter({});

const initialState = toolsAdapter.getInitialState();

export const toolsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTools: builder.query({
      query: () => ({
        url: '/tools',
        validateStatus: (response, result) => {
          return (response.status === 200) && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedTools = responseData.map((tool) => {
          tool.id = tool._id;
          return tool;
        });
        return toolsAdapter.setAll(initialState, loadedTools);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Tool", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Tool", id })),
          ];
        } else return [{ type: "Tool", id: "LIST" }];
      },
    }),
    addNewTool: builder.mutation({
      query: (initialTool) => ({
        url: "/tools",
        method: "POST",
        body: {
          ...initialTool,
        },
      }),
      invalidatesTags: [{ type: "Tool", id: "LIST" }],
    }),
    updateTool: builder.mutation({
      query: (initialTool) => ({
        url: "/tools",
        method: "PATCH",
        body: {
          ...initialTool,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Tool", id: arg.id }],
    }),
    deleteTool: builder.mutation({
      query: ({ id }) => ({
        url: `/tools`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Tool", id: arg.id }],
    }),
  }),
});

export const {
  useGetToolsQuery,
  useAddNewToolMutation,
  useUpdateToolMutation,
  useDeleteToolMutation,
} = toolsApiSlice;

// returns the query result object
export const selectToolsResult = toolsApiSlice.endpoints.getTools.select();

// creates memoized selector
const selectToolsData = createSelector(
  selectToolsResult,
  (toolsResult) => toolsResult.data //normalized state object with ids and entities
);

// getselectors creates these selectors
// we rename them with aliases using destructing
export const {
  selectAll: selectAllTools,
  selectById: selectToolById,
  selectIds: selectToolIds,
} = toolsAdapter.getSelectors(
  (state) => selectToolsData(state) ?? initialState
);
