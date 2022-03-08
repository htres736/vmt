# Clone current Tab

1. User clicks on "create new tab"
2. New Tab Form modal pops up
    * New option to "clone current tab" is shown 
3. User clicks on "clone current tab"
4. Configure the new Tab
    * Read current state from Workspace.populatedRoom[currentTabId]
    * Other configurations depending on Tab type (GGB, etc)
5. Create the new Tab with given config
6. Add new Tab to Current Room
7. Emit a message to update each participant's workspace with the new Tab
8. Navigate to the new Tab


## My Notes

1. Since NewTabForm has access to currentTabs & room, should we display a dropdown for the user to select the tab to clone?
    * Current Tab Id is not provided to the NewTabForm, so we'd need to provide it if we just want to clone the currently selected tab

2. Should the "Clone" Radio button always be present for users on the NewTabForm?

3. I am unsure about how to handle the NewTabForm submit because of line 83, this.uploadGgbFiles()... ran out of time to investigate what's going on here