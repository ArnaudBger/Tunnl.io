# Tunnl

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Brand-Influencer Collaboration DApp

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MavericksFive"><img src="https://avatars.githubusercontent.com/u/95299145?v=4?s=100" width="100px;" alt="0x_mavericks"/><br /><sub><b>0x_mavericks</b></sub></a><br /><a href="https://github.com/MavericksFive/Deals/commits?author=MavericksFive" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Astr0-G"><img src="https://avatars.githubusercontent.com/u/57165451?v=4" width="100px;" alt="0x_mavericks"/><br /><sub><b>Astr0-G</b></sub></a><br /><a href="https://github.com/MavericksFive/Deals/commits?author=Astr0-G" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

# Native App Development

Our native application is developed to ensure a smooth and responsive user experience. Here's an overview of the technology and design approach we've adopted:

## Technology Stack

- `Framework`: We use React Native with Expo. This combination offers a robust platform for developing native applications for both Android and iOS while ensuring code reusability and efficiency.
- `Programming Language`: TypeScript is our choice for development. It enhances code quality and maintainability by introducing static typing, which is especially beneficial in large-scale applications like ours.

## Design Process

- `UI/UX Design`: All designs are meticulously crafted using Figma. This design tool enables us to create high-fidelity interactive prototypes that closely resemble the final product.

- `Design-to-Development Workflow`: The designs in Figma serve as a reference for our development team, ensuring that the application's look and feel aligns closely with the envisioned user experience.

## Highlights

- `Smooth Interactions`: We place a strong emphasis on creating fluid and intuitive interactions within the app to enhance user engagement.

- `Consistent Updates`: The app is regularly updated to incorporate new features, improve performance, and ensure compatibility with the latest devices and OS versions.

Note: Our native app is continuously evolving, driven by user feedback and emerging trends in mobile app development.

# Smart Contracts

In the Tunnl project, we have deployed two key smart contracts to facilitate our operations:

## Technology Stack

- `Token Contract`: This contract manages the digital tokens within our platform. These tokens are integral to our reward and incentive system for influencers.
- `Tunnl Contract`: This is the main contract that governs the interactions between brands and influencers within the Tunnl ecosystem. It includes logic for campaign creation, participation, and tracking.

# Chainlink Automation

We have integrated Chainlink Automation services to streamline the process of verifying influencer activities and distributing rewards. Here's how it works:

- `nstagram Post Verification`: Chainlink Automation is used to monitor Instagram posts made by influencers participating in campaigns.

- `Automatic Token Distribution`: Upon successful verification of a campaign-related Instagram post, our system automatically triggers the Tunnl Contract to distribute our tokens to the respective influencer's account.

This automation ensures a seamless and efficient process, reducing the need for manual verification and token distribution.

Note: The implementation details of the smart contracts and Chainlink integration are subject to ongoing refinement and updates to keep up with technological advancements and community feedback.

# Backend Information

Our backend infrastructure is designed to provide robust and secure services. Here’s an outline of the technology and features we have implemented:

## Technology Stack

- `Framework`: The backend is built on Django, a high-level Python web framework that encourages rapid development and clean, pragmatic design.

- `Authentication`: We employ a unique email-based verification system that does not require a password, streamlining the user onboarding process.

## Wallet Integration

- `Testnet Phase`: Currently operating on the AVAX FUJI Testnet, allowing us to test and refine our processes in a real-world environment.

- `Automated Wallet Creation`: New users are automatically provided with a wallet, removing barriers to entry.

- `Initial Funding`: To facilitate immediate participation, new users receive gas money in their wallets.

- `Email-Based Wallet Services`: For demonstration purposes, we have developed a custom solution where emails serve as wallet identifiers.

- `Security`: Enhanced encryption techniques are in place to ensure the security and integrity of user data and transactions.

## Future Development Plans

- `Mainnet Migration`: We plan to transition our operations to the Mainnet, which will mark a significant milestone in our project's growth.

- `Coinbase Wallet Integration`: Looking ahead, we aim to integrate with renowned wallet services like Coinbase, enhancing our platform's reliability and user trust.

Note: Our backend setup is dynamic and will continuously evolve to incorporate new technologies and user feedback, ensuring scalability and adaptability.
