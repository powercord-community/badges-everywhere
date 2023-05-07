import { components, util } from "replugged";
import { cfg } from ".";

const { SwitchItem, Category, FormNotice } = components;

export function Settings(): React.ReactElement {
  return (
    <>
      {/* @ts-expect-error  hope for fix soon*/}
      <FormNotice
        title="Avoid Ratelimits"
        body="If disabled, you may be ratelimited. Due to the nature of discord's method of fetching badges (apis), users may not have their badges displayed until you click their profile. By disabling this setting, you bypass this and immediately fetch all badges needed to display on screen. This can be prone to ratelimits."
        type={FormNotice.Types.DANGER}
        style={{ marginBottom: 20 }}
      />
      <SwitchItem {...util.useSetting(cfg, "avoidrates", true)}>Avoid Ratelimits</SwitchItem>
      <Category title="Display Badges" open={true}>
        <SwitchItem {...util.useSetting(cfg, "staff", true)}>Display Staff Badges</SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "partner", true)}>Display Partner Badges</SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "moderator", true)}>
          Display Moderator Badges
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "hypesquad", true)}>
          Display Hypesquad Badges
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "bughunter", true)}>
          Display Bughunter Badges
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "developer", true)}>
          Display Developer Badges
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "earlySupporter", true)}>
          Display Early Supporter Badges
        </SwitchItem>
        <SwitchItem
          {...util.useSetting(cfg, "premium", true)}
          note="Both guild boosting and nitro subscription">
          Display Premium Badges
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, "bot", true)} note="Includes slash command badge">
          Display Bot Badges
        </SwitchItem>
      </Category>
    </>
  );
}
