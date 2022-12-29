import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    convs: null,
}

const conversationsSlice = createSlice({
    name: 'convs',
    initialState,
    reducers: {
        setConvs: (state, action) => {
            state.convs = action.payload;
        },
        updateConversation: (state, action) => {
            // Find the conversation to update by matching the id
            const conversationIndex = state.convs.findIndex((conv) => conv.id === action.payload.id);

            console.log(conversationIndex, action.payload.id);
            // If the conversation was found, update it with the new values
            if (conversationIndex !== -1) {
                state.convs[conversationIndex] = {
                    ...state.convs[conversationIndex],
                    ...action.payload,
                };
            }
        },
    },
});


export const { setConvs, updateConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer;