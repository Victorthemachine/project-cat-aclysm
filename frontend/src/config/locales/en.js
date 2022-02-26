// In case I or anyone else needs solution for mass translation (which I doubt), but refactoring the code would be simple really
// So I will leave reference for babel plugin that automates it. File has to be JSON though!
// https://codeandweb.com/babeledit/tutorials/how-to-translate-your-react-app-with-react-intl
export const en_messages = {
    welcome: 'Welcome lads and ladettes',

    sign_in: 'Authentification step',
    sign_in_context: `Your sessing has expired or you haven't yet used the bot.
    Head to Discord and use command /manage.
    Paste your PIN you received from the bot in your DMs or simply open the link.`,
    entry_pin: 'Enter your PIN',
    invalid_entry_pin: 'PIN must be 10 characters long',
    password: 'Password',
    submit_pin: 'Submit',
    to_discord: 'Open Discord',

    dashboard: 'Dashboard',
    invite_alert_title: 'Invite',
    invite_alert_success: 'Successfully created invite. It is copied to your clipboard!',
    invite_alert_error: `Couldn't create invite. Perhaps your permissions changed?`,

    guild_position: 'Your standing is:',
    invite_btn: "Invite",
    manage_btn: "Manage",
    roles_btn: "Roles",
    owner: 'Owner:',
    
    role_header: 'Roles for you in',
    submit_roles: 'Submit',

    manage_role_list_header: 'Set rules for roles',
    manage_submit_btn: 'Apply changes'
}
