import { components, util } from "replugged";
import { cfg } from ".";

const { SwitchItem } = components;

export function Settings(): React.ReactElement {
  return (
    <>
      <SwitchItem {...util.useSetting(cfg, "staff", true)}>Display Staff Badges</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "partner", true)}>Display Partner Badges</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "moderator", true)}>Display Moderator Badges</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "hypesquad", true)}>Display Hypesquad Badges</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "bughunter", true)}>Display Bughunter Badges</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "developer", true)}>Display Developer Badges</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "earlySupporter", true)}>
        Display Early Supporter Badges
      </SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "premium", true)}>Display Premium Badges</SwitchItem>
    </>
  );
}
