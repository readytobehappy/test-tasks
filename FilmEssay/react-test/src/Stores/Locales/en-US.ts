import { Locale } from "./Locale";

/** String resources for cuture en-US */
export default class LocaleEnUs extends Locale {
    Title = "Star Wars movie reviews";
    MoviesList = {
        ListIsLoading: "Loading...",
        MovieIsLoading: "Loading...",
        FormIsLoading: "Loading...",
        AddReview: "Add a review",
        ReviewFormTitle: "Your review"
    };
    Review = {
        Title: "Your review",
        UserName: "User name*:",
        Email: "E-Mail*:",
        Review: "Review text*:",
        SendButton: "Send",
        CongratDialog: {
            Header: "Information",
            Message: "Thank you for your review",
            OkButton: "OK"
        },
        ReviewHeader: "Review by {user} at {date}"
    }

    public constructor() {
        super("en-US");
    }
}