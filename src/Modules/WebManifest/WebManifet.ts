// src/Modules/WebManifest/WebManifest.ts
export interface Icon {
  src: string;
  sizes: string;
  type: string;
}

export enum DisplayMode {
  FULLSCREEN = 'fullscreen',
  STANDALONE = 'standalone',
  MINIMAL = 'minimal-ui',
  BROWSER = 'browser',
}

export interface WebManifest {
  /**
   * The name member is a string that represents the name of the web application as
   * it is usually displayed to the user (e.g., amongst a list of other applications, or as a label for an icon).
   * name is directionality-capable, which means it can be displayed left-to-right or right-to-left based on the values
   * of the dir and lang manifest members.
   */
  name: string;

  /**
   * The short_name member is a string that represents the name of the web application displayed
   * to the user if there is not enough space to display name (e.g., as a label for an icon on the phone home screen).
   * short_name is directionality-capable, which means it can be displayed left-to-right or right-to-left based on the
   * value of the dir and lang manifest members.
   */
  short_name: string;

  /**
   * The start_url member is a string that represents the start URL of the web application —
   * the prefered URL that should be loaded when the user launches the web application
   * (e.g., when the user taps on the web application's icon from a device's application menu or homescreen).
   */
  start_url: string;

  /**
   * The display member is a string that determines the developers’ preferred display mode for the website.
   * The display mode changes how much of browser UI is shown to the user and can range from "browser"
   * (when the full browser window is shown) to "fullscreen" (when the app is full-screened).
   */
  display: DisplayMode;

  /**
   * The background_color member defines a placeholder background color for the application page
   * to display before its stylesheet is loaded. This value is used by the user agent to draw the background color
   * of a shortcut when the manifest is available before the stylesheet has loaded.
   * Therefore background_color should match the background-color CSS property in the site’s stylesheet
   * for a smooth transition between launching the web application and loading the site's content.
   */
  background_color: string;

  /**
   * The description member is a string in which developers can explain what the application does.
   * description is directionality-capable, which means it can be displayed left to right or right to left
   * based on the values of the dir and lang manifest members.
   */
  description: string;

  /**
   * The icons member specifies an array of objects representing image files that can serve as
   * application icons for different contexts. For example, they can be used to represent the
   * web application amongst a list of other applications, or to integrate the web application with an OS's task switcher
   * and/or system preferences.
   */
  icons: Icon[];
}
